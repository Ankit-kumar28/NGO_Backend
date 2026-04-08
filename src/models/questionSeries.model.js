import mongoose from "mongoose";

const questionSeriesSchema = new mongoose.Schema(
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
    
    seriesType: {
      type: String,
      enum: ["101", "51", "31"],
      required: [true, "Series type is required"],
      index: true,
    },

    code: {
      type: String,
      // required: [true, "Code is required"],
      // unique: true,
      // uppercase: true,
      // trim: true,
    },

    
    tag: {
      type: String,      
      trim: true,
      index: true,
    },
    tagLine: {
      type: String,       
      trim: true,
    },
    tagColor: {
      accent: { type: String, trim: true },   
      light:  { type: String, trim: true },   
      pill:   { type: String, trim: true },   
    },

    audience: {
      type: String,      
      trim: true,
    },
    level: {
      type: String,
      enum: [
        "Beginner",
        "Beginner to Intermediate",
        "Intermediate",
        "Advanced",
      ],
      default: "Beginner",
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
    icon: {
      type: String,     
      trim: true,
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
      required: [false, "Creator is required"],
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

// ── COMPOUND INDEX ───────────────────────────────────────────
// Used by getQuestionSeries public query
// questionSeriesSchema.index({
//   ngo:        1,
//   seriesType: 1,
//   status:     1,
//   visibility: 1,
//   order:      1,
// });

export const QuestionSeries = mongoose.model(
  "QuestionSeries",
  questionSeriesSchema
);