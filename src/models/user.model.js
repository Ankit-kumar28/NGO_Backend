import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ["admin"], // 🔥 simplify for your project
      default: "admin"
    },

    // 🔥 VERY IMPORTANT (tenant link)
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    phone: String,

    avatar: String
  },
  { timestamps: true }
);

// optional index
// userSchema.index({ email: 1 });

export default mongoose.model("User", userSchema);