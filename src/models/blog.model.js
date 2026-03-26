import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
  {
    // 📝 Title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔗 SEO URL
    slug: {
      type: String,
      unique: true,
      index: true,
    },

    // 🔥 Internal / External Blog
    contentType: {
      type: String,
      enum: ["internal", "external"],
      default: "internal",
      required: true,
    },

    // 📄 Internal Content
    content: {
      type: String,
      default:"xyz"
    },

    // 🌐 External Link
    externalUrl: {
      type: String,
      default:""
    },

    // 📌 Short preview
    discription: {
      type: String,
      maxlength: 300,
      trim: true,
      default:""
    },

    // 🖼️ Cover Image
    coverImage: {
      type: String, // /uploads/ASGI/image.jpg
      default:""
    },

    // 📄 PDF Support 🔥
    pdfUrl: {
      type: String, // /uploads/ASGI/file.pdf
      default:""
    },

    // 📚 Type
    type: {
      type: String,
      enum: ["blog", "article"],
      default: "blog",
    },

    // 🏢 NGO (Multi-tenant 🔥)
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true,
      index: true,
    },

    // 👤 Admin (who created)
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //  Category & Tags
    category: {
      type: String,
      trim: true,
      default:""
    },


    // 📊 Status
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
    },

    // 🌍 Visibility
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    

    source:{
        type:String,
        default:"Linkedin"
    },
    // ⏱️ Read Time
    readTime: {
      type: Number,
      default:5
    },

    // 👁️ Views
    views: {
      type: Number,
      default: 0,
    },

    // 📅 Publish Date
    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);


// 🔥 SLUG GENERATION
blogSchema.pre("save", async function () {
  if (this.isModified("title")) {
    this.slug =
      slugify(this.title, { lower: true, strict: true }) +
      "-" +
      Date.now();
  }
});


// 🔥 VALIDATION (IMPORTANT)
blogSchema.pre("validate", async function () {
  if (this.contentType === "internal" && !this.content) {
    throw new Error("Content required for internal blog");
  }

  if (this.contentType === "external" && !this.externalUrl) {
    throw new Error("External URL required");
  }
});


export const Blog = mongoose.model("Blog", blogSchema);