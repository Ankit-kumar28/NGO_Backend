import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
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

    phone: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 1
    },

    transactionId: {
      type: String,
      required: true,
      unique: true // 🔥 prevents duplicate payments
    },

    paymentMethod: {
      type: String,
      enum: ["upi", "bank", "netbanking", "cash"],
      required: true
    },

    message: {
      type: String
    },

    // 🔥 MULTI-TENANT KEY
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true,
   
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    status: {
  type: String,
  enum: ["pending", "verified", "failed"],
  default: "pending",   
  
},

// 🔥 Admin verification
verifiedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},

verifiedAt: {
  type: Date
}
  },
  { timestamps: true }
);

// index for fast queries
donationSchema.index({ ngo: 1 });

export default mongoose.model("Donation", donationSchema);