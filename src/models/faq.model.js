import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true
    },

    answer: {
      type: String,
      required: true
    },

    
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true
    },

   
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);



export default mongoose.model("FAQ", faqSchema);