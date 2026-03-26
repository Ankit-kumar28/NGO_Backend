import { Blog } from "../models/blog.model.js";
import fs from "fs";
import path from "path";

// ================= CREATE BLOG =================
export const createBlog = async (req, res) => {
  try {
    console.log("Creating Blog");

    const {
      title,
      content,
      externalUrl,
      contentType,
      discription,
      category,
      status,
      visibility
    } = req.body;

    let coverImage = "";
    let pdfUrl = "";

    if (req.file) {
      const filePath = `/uploads/${req.ngoName}/${req.file.filename}`;

      if (req.file.mimetype === "application/pdf") {
        pdfUrl = filePath;
      } else {
        coverImage = filePath;
      }
    }

    const blog = await Blog.create({
      title,
      content,
      externalUrl,
      contentType,
      discription,
      category,
      status,
      visibility,
      coverImage,
      pdfUrl,
      ngo: req.ngoId,
      author: req.user.id,
      publishedAt: status === "published" ? new Date() : null
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      ngo: req.ngo,
      status: "published",
      visibility: "public"
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: blogs.length,
      data: blogs
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.ngo) {
      return res.status(400).json({
        success: false,
        message: "NGO context not found"
      });
    }

    const blog = await Blog.findOne({
      _id: id,
      ngo: req.ngo,
      status: "published",
      visibility: "public"
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found or not accessible"
      });
    }

    // Increment views
    blog.views = (blog.views || 0) + 1;
    await blog.save();

    res.json({
      success: true,
      data: blog
    });

  } catch (error) {
    console.error("Get Single Blog Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      author: req.user.id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: blogs.length,
      data: blogs
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findOne({
      _id: id,
      author: req.user.id
    });

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found or unauthorized"
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
      message: "Blog deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};