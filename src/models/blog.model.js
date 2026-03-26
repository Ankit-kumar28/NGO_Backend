import mongoose from "mongoose";


const blogSchema = new mongoose.Schema(
  {
    
    title: {
      type: String,
      required: true,
      trim: true,
    },

   
    contentType: {
      type: String,
      enum: ["internal", "external"],
      default: "internal",
      required: true,
    },

    content: {
      type: String,
      default:"xyz"
    },

    externalUrl: {
      type: String,
      default:""
    },
    discription: {
      type: String,
      maxlength: 300,
      trim: true,
      default:""
    },

    coverImage: {
      type: String, 
      default:""
    },

    pdfUrl: {
      type: String, 
      default:""
    },
    type: {
      type: String,
      enum: ["blog", "article"],
      default: "blog",
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

    
    category: {
      type: String,
      trim: true,
      default:""
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
    

    source:{
        type:String,
        default:"Linkedin"
    },
    readTime: {
      type: Number,
      default:5
    },

    views: {
      type: Number,
      default: 0,
    },

    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);





//  VALIDATION (IMPORTANT)
blogSchema.pre("validate", async function () {
  if (this.contentType === "internal" && !this.content) {
    throw new Error("Content required for internal blog");
  }

  if (this.contentType === "external" && !this.externalUrl) {
    throw new Error("External URL required");
  }
});


export const Blog = mongoose.model("Blog", blogSchema);