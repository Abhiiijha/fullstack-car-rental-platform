import mongoose from "mongoose";
import Car from "./carModel.js";

const { Schema } = mongoose;

// Address Schema (embedded)
const addressSchema = new Schema(
  {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  { _id: false, default: {} },
);

// Car summary schema (embedded in booking)
const carSummarySchema = new Schema(
  {
    carId: { type: Schema.Types.ObjectId, ref: "Car", required: true },
    make: { type: String, default: "" },
    model: { type: String, default: "" },
    year: Number,
    dailyRate: { type: Number, default: 0 },
    category: { type: String, default: "Sedan" },
    seats: { type: Number, default: 4 },
    transmission: { type: String, default: "" },
    fuelType: { type: String, default: "" },
    mileage: { type: Number, default: 0 },
    image: { type: String, default: "" },
  },
  { _id: false },
);

// Booking Schema
const bookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    customer: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    car: { type: carSummarySchema, required: true },
    carImage: { type: String, default: "" },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    bookingDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "cancelled", "upcoming"],
      default: "pending",
    },
    amount: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Credit Card", "Paypal"],
      default: "Credit Card",
    },
    sessionId: String,
    paymentIntentId: String,
    address: { type: addressSchema, default: () => ({}) },
    stripeSession: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

// ----------------- Pre-validation hook -----------------
bookingSchema.pre("validate", async function () {
  if (!this.car?.carId) return;

  const { make, model, dailyRate } = this.car;
  if (make || model || dailyRate) return;

  try {
    const carDoc = await Car.findById(this.car.carId).lean();
    if (carDoc) {
      Object.assign(this.car, {
        make: carDoc.make ?? this.car.make,
        model: carDoc.model ?? this.car.model,
        year: carDoc.year ?? this.car.year,
        dailyRate: carDoc.dailyRate ?? this.car.dailyRate,
        seats: carDoc.seats ?? this.car.seats,
        transmission: carDoc.transmission ?? this.car.transmission,
        fuelType: carDoc.fuelType ?? this.car.fuelType,
        mileage: carDoc.mileage ?? this.car.mileage,
        image: carDoc.image ?? this.car.image,
        category: carDoc.category ?? this.car.category,
      });

      if (!this.carImage) this.carImage = carDoc.image || "";
    }
  } catch (err) {
    console.error("Pre-validate booking hook error:", err);
    throw err; // important
  }
});

// ----------------- Post-save hook -----------------
const blockingStatuses = ["pending", "active", "upcoming"];

bookingSchema.post("save", async function (doc) {
  if (!doc.car?.carId) return;

  const carId = doc.car.carId;

  const bookingEntry = {
    bookingId: doc._id,
    pickupDate: doc.pickupDate,
    returnDate: doc.returnDate,
    status: doc.status,
  };

  try {
    if (blockingStatuses.includes(doc.status)) {
      await Car.findByIdAndUpdate(carId, {
        $pull: { bookings: { bookingId: doc._id } },
      });

      await Car.findByIdAndUpdate(carId, { $push: { bookings: bookingEntry } });
    } else {
      await Car.findByIdAndUpdate(carId, {
        $pull: { bookings: { bookingId: doc._id } },
      });
    }
  } catch (err) {
    console.error("Post-save booking hook error:", err);
  }
});

// ----------------- Post-remove hook -----------------
bookingSchema.post("findOneAndDelete", async function (doc) {
  if (!doc?.car?.carId) return;

  try {
    await Car.findByIdAndUpdate(doc.car.carId, {
      $pull: { bookings: { bookingId: doc._id } },
    });
  } catch (err) {
    console.error("Post-delete booking hook error:", err);
  }
});

export default mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema);
