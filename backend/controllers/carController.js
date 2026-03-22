import Car from "../models/carModel.js";
import path from "path";
import fs from "fs";

// CREATE CAR
export const createCar = async (req, res, next) => {
  try {
    const {
      make,
      model,
      dailyRate,
      category,
      description,
      year,
      color,
      seats,
      transmission,
      fuelType,
      mileage,
      status,
    } = req.body;

    if (!make || !model || !dailyRate) {
      return res.status(400).json({
        message: "Make, model and daily rate are required.",
      });
    }

    const imageFilename = req.file ? req.file.filename : "";

    const car = new Car({
      make,
      model,
      year: year ? Number(year) : undefined,
      color: color || "",
      category: category || "Sedan",
      seats: seats ? Number(seats) : 4,
      transmission: transmission || "Automatic",
      fuelType: fuelType || "Gasoline",
      mileage: mileage ? Number(mileage) : 0,
      dailyRate: Number(dailyRate),
      status: status || "available",
      image: imageFilename,
      description: description || "",
    });

    const savedCar = await car.save();
    res.status(201).json(savedCar);
  } catch (err) {
    next(err);
  }
};

// GET ALL CARS (WITH PAGINATION & SEARCH)
export const getCars = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const category = req.query.category || "";
    const status = req.query.status || "";

    const query = {};

    if (search) {
      query.$or = [
        { make: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
        { color: { $regex: search, $options: "i" } },
      ];
    }

    if (category) query.category = category;
    if (status) query.status = status;

    const cars = await Car.find(query).sort({ createdAt: -1 });

    const data = cars.map((car) => {
      const plain = car.toObject();
      plain.availability = car.getAvailabilitySummary?.();
      return plain;
    });

    res.json({
      success: true,
      cars: data,
    });
  } catch (err) {
    next(err);
  }
};

// GET CAR BY ID
export const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const plain = car.toObject();
    plain.availability = car.getAvailabilitySummary?.();
    res.json(plain);
  } catch (err) {
    next(err);
  }
};

// UPDATE CAR
export const updateCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Handle image update
    if (req.file) {
      if (car.image) {
        const oldPath = path.join(process.cwd(), "uploads", car.image);
        fs.unlink(oldPath, () => {});
      }
      car.image = req.file.filename;
    } else if (req.body.image === "") {
      if (car.image) {
        const oldPath = path.join(process.cwd(), "uploads", car.image);
        fs.unlink(oldPath, () => {});
      }
      car.image = "";
    }

    const fields = [
      "make",
      "model",
      "year",
      "color",
      "category",
      "seats",
      "transmission",
      "fuelType",
      "mileage",
      "dailyRate",
      "status",
      "description",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (["year", "seats", "mileage", "dailyRate"].includes(field)) {
          car[field] = Number(req.body[field]);
        } else {
          car[field] = req.body[field];
        }
      }
    });

    const updatedCar = await car.save();
    res.json(updatedCar);
  } catch (err) {
    next(err);
  }
};

// DELETE CAR
export const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    if (car.image) {
      const filePath = path.join(process.cwd(), "uploads", car.image);
      fs.unlink(filePath, () => {});
    }

    res.json({ message: "Car deleted successfully!" });
  } catch (err) {
    next(err);
  }
};
