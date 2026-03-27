import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    // BASIC INFO
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      trim: true,
    },

    topics: [
      {
        type: String,
        trim: true,
      },
    ],

    // DATE & TIME
    date: {
      type: String,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
    },

    month: {
      type: Number,
      index: true,
    },

    year: {
      type: Number,
      index: true,
    },

    // MEDIA
    image: {
      type: String,
    },

    pdfUrl: {
      type: String,
    },

    // LINKS
    registrationLink: {
      type: String,
    },
    badge:{
      type: String,
    },
     badgeColor:{
      type: String,
     },

    // STATUS
    // status: {
    //   type: String,
    //   enum: ["upcoming", "ongoing", "completed", "cancelled"],
    //   default: "upcoming",
    // },

    visibility: {
      type: String,
      enum: ["public", "private", "draft"],
      default: "public",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    // RELATIONS
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Event = mongoose.model("Event", eventSchema);