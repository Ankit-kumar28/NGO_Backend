// models/getInvolved.model.js
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

    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    profession: {
      type: String,
      trim: true
    },
    message: {
      type: String,
      trim: true
    },

    membershipType: {
      type: String,
    
    },
    otherMembershipType: {
      type: String,
      trim: true 
    },

    area: {
      type: String,
     
    },
    college: {
      type: String,
      trim: true
    },
    resumePath: {
      type: String,  
      trim: true
    },

    status: {
      type: String,
      enum: ["new", "reviewed", "accepted", "rejected"],
      default: "new"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("GetInvolved", getInvolvedSchema);