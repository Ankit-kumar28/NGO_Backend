// models/knowledgeBase.model.js
import mongoose from "mongoose";

const knowledgeBaseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    tag: {
      type: String,
      trim: true,
      index: true,
    },

    tagColor: {
      pill:    { type: String, trim: true },  
      dot:     { type: String, trim: true }, 
      text:    { type: String, trim: true },  
      border:  { type: String, trim: true },  
      hover:   { type: String, trim: true },  
      accent:  { type: String, trim: true },  
      light:   { type: String, trim: true },  
    },

    highlights: [
      {
        type: String,
        trim: true,
      },
    ],

    pdfUrl: {
      type: String,
      trim: true,
      default: "",
    },
    coverImage: {
      type: String,
      trim: true,
      default: "",
    },

    readTime: {
      type: Number,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },

    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: [true, "NGO is required"],
      index: true,
    },
    createdBy: {                              
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
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
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
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

// ── COMPOUND INDEX ─────────────────────────────────────────────
// knowledgeBaseSchema.index({
//   ngo:        1,
//   status:     1,
//   visibility: 1,
//   order:      1,
// });


export const KnowledgeBase = mongoose.model(
  "KnowledgeBase",
  knowledgeBaseSchema
);