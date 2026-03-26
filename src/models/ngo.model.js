import mongoose from "mongoose";

const ngoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    code: {
      type: String,
      required: true,
      unique: true 
    },

    email: {
      type: String,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("NGO", ngoSchema);