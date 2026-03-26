import mongoose from "mongoose";
import slugify from "slugify";

const eventSchema = new mongoose.Schema(
  {
    // 📝 Title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔗 Slug (SEO)
    slug: {
      type: String,
      unique: true,
      index: true,
    },

    // 📄 Description
    description: {
      type: String,
      required: false,
    },

    // 🖼️ Event Poster
    posterImage: {
      type: String, // /uploads/ASGI/event.jpg
    },

    // 📄 Optional PDF (brochure)
    pdfUrl: {
      type: String,
    },

    location: {
      type: String,
      required: false,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
      index: true,
    },

    state: {
      type: String,
      trim: true,
    },

    // 📅 Event Dates
    startDate: {
      type: Date,
      required: false,
      index: true,
    },

    endDate: {
      type: Date,
    },

    // ⏰ Time
    startTime: String,
    endTime: String,

    // 🎟️ Registration Link (optional)
    registrationLink: {
      type: String,
    },

    // 🏢 NGO (Multi-tenant 🔥)
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true,
      index: true,
    },

    // 👤 Admin (creator)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 📊 Status
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
      index: true,
    },

    // 🌍 Visibility
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    // ⭐ Featured
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    // 👁️ Views
    views: {
      type: Number,
      default: 0,
    },

    // 🏷️ Tags
    tags: [
      {
        type: String,
        trim: true,
      }
    ],
  },
  {
    timestamps: true,
  }
);


// 🔥 SLUG GENERATION
eventSchema.pre("save", async function () {
  if (this.isModified("title")) {
    this.slug =
      slugify(this.title, { lower: true, strict: true }) +
      "-" +
      Date.now();
  }
});

export const Event = mongoose.model("Event", eventSchema);