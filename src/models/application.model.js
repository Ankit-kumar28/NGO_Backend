import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true
    },

    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GetInvolved",
      required: true
    },

    type: {
      type: String,
      enum: ["membership", "volunteer", "internship"]
    },

    name: String,
    email: String,
    phone: String,

    data: {
      type: Object
    },

    status: {
      type: String,
      enum: ["new", "reviewing", "accepted", "rejected"],
      default: "new"
    }
  },
  { timestamps: true }
);

applicationSchema.index({ ngo: 1, type: 1, status: 1 });

export default mongoose.model("Application", applicationSchema);