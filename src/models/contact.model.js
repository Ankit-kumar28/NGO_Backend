import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    phone: String,

    subject: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending"
    }
  },
  { timestamps: true }
);


export default mongoose.model("Contact", contactSchema);