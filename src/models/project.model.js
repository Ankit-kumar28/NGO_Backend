import mongoose from "mongoose";
import slugify from "slugify";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      unique: true,
      index: true
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

projectSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug =
      slugify(this.title, { lower: true, strict: true }) +
      "-" +
      Date.now();
  }
});

export const Project = mongoose.model("Project", projectSchema);