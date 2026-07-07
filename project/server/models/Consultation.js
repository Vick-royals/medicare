import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    doctor: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    slots: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ["Physical Visit", "Virtual Visit"],
      default: "Physical Visit",
    },
    typeColor: {
      type: String,
      default: "bg-blue-100 text-blue-700",
    },
    avatar: {
      type: String,
    },
    // For user's booked appointments
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["Available", "Confirmed", "Completed", "Cancelled"],
      default: "Available",
    },
    statusColor: {
      type: String,
      default: "bg-green-100 text-green-700",
    },
  },
  {
    timestamps: true,
  }
);

const Consultation = mongoose.model("Consultation", consultationSchema);
export default Consultation;
