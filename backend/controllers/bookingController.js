import mongoose from "mongoose";
import Booking from "../models/bookingModel.js";
import Car from "../models/carModel.js";

import path from "path";
import fs from "fs";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const BLOCKING_STATUSES = ["pending", "active", "upcoming"];

const tryParseJSON = (v) => {
  if (typeof v !== "string") return v;
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
};

const normalizePickup = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const normalizeReturn = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const buildCarSummary = (src = {}) => {
  const carId = src._id?.toString?.() || src.id || src.carId || null;
  return {
    carId,
    make: src.make,
    model: src.model || "",
    year: src.year ? Number(src.year) : null,
    dailyRate: src.dailyRate ? Number(src.dailyRate) : 0,
    seats: src.seats ? Number(src.seats) : 4,
    transmission: src.transmission,
    fuelType: src.fuelType,
    mileage: src.mileage ? Number(src.mileage) : 0,
    image: src.image || src.carImage || "",
  };
};

const deleteLocalFileIfPresent = (filePath) => {
  if (!filePath) return;
  const filename = filePath.replace(/^\/uploads\//, "");
  const full = path.join(UPLOADS_DIR, filename);
  fs.unlink(full, (err) => {
    if (err) console.warn("File delete failed:", full);
  });
};

// CREATE BOOKING
export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let {
      customer,
      email,
      phone,
      car,
      pickupDate,
      returnDate,
      amount,
      details,
      address,
      carImage,
    } = req.body;

    if (!customer || !email || !car || !pickupDate || !returnDate) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Normalize dates (timezone-safe)
    const pickup = normalizePickup(pickupDate);
    const ret = normalizeReturn(returnDate);

    if (pickup > ret) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Invalid pickup and return date",
      });
    }

    // Resolve car
    let carSummary = null;

    if (typeof car === "string" && /^[0-9a-fA-F]{24}$/.test(car)) {
      const carDoc = await Car.findById(car).session(session).lean();
      if (!carDoc) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "Car not found",
        });
      }
      carSummary = buildCarSummary(carDoc);
    } else {
      const parsed = tryParseJSON(car);
      carSummary = buildCarSummary(parsed);

      if (!carSummary.carId) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: "Invalid car payload",
        });
      }
    }

    const carId = carSummary.carId;

    // Overlap check inside transaction
    const overlappingCount = await Booking.countDocuments({
      "car.carId": carId,
      status: { $in: BLOCKING_STATUSES },
      pickupDate: { $lte: ret },
      returnDate: { $gte: pickup },
    }).session(session);

    if (overlappingCount > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({
        success: false,
        message: "Car already booked for selected dates",
      });
    }

    // Create booking
    const bookingData = {
      userId: req?.user?.id || req?.user?._id || null,
      customer,
      email,
      phone,
      car: carSummary,
      carImage: carImage || carSummary.image || "",
      pickupDate: pickup,
      returnDate: ret,
      amount: Number(amount || 0),
      details: tryParseJSON(details),
      address: tryParseJSON(address),
      paymentStatus: "pending",
      status: "pending",
    };

    const createdArr = await Booking.create([bookingData], { session });
    const createdBooking = createdArr[0];

    // Optional: push to car document
    await Car.findByIdAndUpdate(
      carId,
      {
        $push: {
          bookings: {
            bookingId: createdBooking._id,
            pickupDate: createdBooking.pickupDate,
            returnDate: createdBooking.returnDate,
            status: createdBooking.status,
          },
        },
      },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    const saved = await Booking.findById(createdBooking._id).lean();

    return res.status(201).json({
      success: true,
      booking: saved,
    });
  } catch (err) {
    await session.abortTransaction().catch(() => {});
    session.endSession();

    console.error("Create Booking Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET BOOKINGS
export const getBooking = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 12, 100);

    const query = {};

    const total = await Booking.countDocuments(query);

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      page,
      pages: Math.ceil(total / limit),
      total,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

// GET MY BOOKINGS
export const getMyBookings = async (req, res, next) => {
  try {
    if (!req.user || (!req.user.id && !req.user._id)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = req.user._id || req.user.id;

    const bookings = await Booking.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// UPDATE BOOKING
export const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.file) {
      if (booking.carImage?.startsWith("/uploads/"))
        deleteLocalFileIfPresent(booking.carImage);

      booking.carImage = `/uploads/${req.file.filename}`;
    }

    Object.assign(booking, req.body);

    const updated = await booking.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// UPDATE STATUS
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) return res.status(400).json({ message: "Status is required" });

    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ message: "Booking not found." });

    booking.status = status;
    const updated = await booking.save();

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE BOOKING
export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ message: "Booking not found." });

    if (booking.carImage?.startsWith("/uploads/"))
      deleteLocalFileIfPresent(booking.carImage);

    await booking.deleteOne();

    res.json({ message: "Booking deleted successfully!" });
  } catch (err) {
    next(err);
  }
};
