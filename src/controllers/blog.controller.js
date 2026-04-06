import { Blog } from "../models/blog.model.js";
import fs from "fs";
import path from "path";
import sanitizeHtml from 'sanitize-html';

const sanitizeOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "strong", "em", "u",
    "ul", "ol", "li", "blockquote", "a", "img", "div", "span",
    "table", "thead", "tbody", "tr", "th", "td", "hr", 
    "style", "header", "section", "footer", "article" 
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "width", "height"],
    "*": ["class", "style"] 
  },
 
  allowVulnerableTags: true, 
  disallowedTagsMode: "discard",
};

export const createBlog = async (req, res) => {
  try {
    console.log("Creating Blog");

    const {
      title,
      content,
      externalUrl,
      contentType = "external",
      excerpt = "",
      category = "",
      status = "published",
      visibility = "public",
      source = "LinkedIn",
      readTime,       
     
      month,
      year,
    } = req.body;

    let finalContent = content || "";
    if (contentType === "internal" && finalContent) {
      finalContent = sanitizeHtml(finalContent, sanitizeOptions);
      console.log(" Internal content sanitized");
    }

  const folder = req.ngoName || "default";

const coverImage = req.files?.coverImage?.[0]
  ? `/uploads/${folder}/${req.files.coverImage[0].filename}`
  : null;

const pdfUrl = req.files?.pdfUrl?.[0]
  ? `/uploads/${folder}/${req.files.pdfUrl[0].filename}`
  : null;

 
    const blog = await Blog.create({
      title,
      content: finalContent,           
      externalUrl,
      contentType,
      excerpt,
      category,
      status,
      visibility,
      source,
      readTime,      
      
      month: month ? Number(month) : undefined,
      year: year ? Number(year) : undefined,
      coverImage,
      pdfUrl,
      ngo: req.ngoId,
      author: req.user.id,
      publishedAt: status === "published" ? new Date() : null,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });

  } catch (error) {
    console.error("Create Blog Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create blog",
    });
  }
};


export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      ngo: req.ngo,
      status: "published",
      visibility: "public",
    })
      .sort({  createdAt: -1 }) ;
      

    res.json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    console.error("Get Blogs Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.ngo) {
      return res.status(400).json({
        success: false,
        message: "NGO context not found",
      });
    }

    const blog = await Blog.findOne({
      _id: id,
      ngo: req.ngo,
      status: "published",
      visibility: "public",
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found or not accessible",
      });
    }

    blog.views = (blog.views || 0) + 1;
    await blog.save();

    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Get Single Blog Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      author: req.user.id,
    }).sort({ year: -1, month: -1, date: -1, createdAt: -1 });

    res.json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    console.error("Get My Blogs Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findOne({
      _id: id,
      author: req.user.id,
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found or unauthorized",
      });
    }

    if (blog.coverImage) {
      const imgPath = path.join("public", blog.coverImage);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    if (blog.pdfUrl) {
      const pdfPath = path.join("public", blog.pdfUrl);
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }

    await Blog.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete Blog Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};