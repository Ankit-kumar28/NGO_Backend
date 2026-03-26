import mongoose from "mongoose";
import slugify from "slugify";

const knowledgeBaseSchema = new mongoose.Schema(
  {
    // 📝 Title
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },

    subtitle: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      trim: true,
      index: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      }
    ],

    keyTopics: [
      {
        type: String,
        trim: true,
      }
    ],
    readTime: {
      type: Number,
    },

    pdfUrl: {
      type: String, 
    },

    coverImage: {
      type: String,
    },

    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true,
      index: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);



 knowledgeBaseSchema.pre("save", function () {
  if (this.isModified("title")) {
    this.slug =
      slugify(this.title, { lower: true, strict: true }) +
      "-" +
      Date.now();
  }
});


export const knowledgeBase = mongoose.model(
  " KnowledgeBase",
   knowledgeBaseSchema
);