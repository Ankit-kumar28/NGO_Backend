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
      enum: ["admin", "superadmin"],
      default: "admin"
    },
   ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: function () {
        return this.role === "admin";
      }
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


export default mongoose.model("User", userSchema);