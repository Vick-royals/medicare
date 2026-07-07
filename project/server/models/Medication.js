import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    dose: {
      type: String,
      required: true,
    },
    instruction: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
    },
    route: {
      type: String,
      required: true,
    },
    remaining: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "low", "inactive"],
      default: "active",
    },
    color: {
      type: String,
      default: "bg-blue-100",
    },
    pillColor: {
      type: String,
      default: "text-blue-500",
    },
  },
  {
    timestamps: true,
  }
);

const Medication = mongoose.model("Medication", medicationSchema);
export default Medication;
