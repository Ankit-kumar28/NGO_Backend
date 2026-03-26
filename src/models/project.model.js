import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    content: {
      type: String
    },

    coverImage: {
      type: String
    },

    images: [
      {
        type: String
      }
    ],

    pdfUrl: {
      type: String
    },

    location: String,

    startDate: Date,
    endDate: Date,

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "ongoing"
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    },

    views: {
      type: Number,
      default: 0
    },

    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true,
      index: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);