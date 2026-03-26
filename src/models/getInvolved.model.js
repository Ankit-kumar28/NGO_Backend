import mongoose from "mongoose";

const getInvolvedSchema = new mongoose.Schema(
  {
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: ["membership", "volunteer", "internship"],
      required: true
    },

    applicationMode: {
      type: String,
      enum: ["internal", "external"],
      default: "internal"
    },

    externalLink: String,

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// 🔥 prevent duplicate type per NGO
getInvolvedSchema.index({ ngo: 1, type: 1 }, { unique: true });

export default mongoose.model("GetInvolved", getInvolvedSchema);