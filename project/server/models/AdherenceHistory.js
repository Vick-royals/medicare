import mongoose from "mongoose";

const adherenceHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medication",
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["taken", "missed", "snoozed", "nodata"],
      default: "nodata",
    },
  },
  {
    timestamps: true,
  }
);

const AdherenceHistory = mongoose.model("AdherenceHistory", adherenceHistorySchema);
export default AdherenceHistory;
