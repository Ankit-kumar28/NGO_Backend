import { Project } from "../models/project.model.js";
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

export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      location,
      date,
      status,
      visibility,
      isFeatured
    } = req.body;

    // Sanitize HTML content (like blog controller does)
    let finalContent = content || "";
    if (finalContent) {
      finalContent = sanitizeHtml(finalContent, sanitizeOptions);
    }

    let coverImage = "";
    let pdfUrl = "";
    let images = [];

    if (req.files) {
      if (req.files["coverImage"] && req.files["coverImage"][0]) {
        coverImage = `/uploads/${req.ngoName}/${req.files["coverImage"][0].filename}`;
      }
      if (req.files["pdfUrl"] && req.files["pdfUrl"][0]) {
        pdfUrl = `/uploads/${req.ngoName}/${req.files["pdfUrl"][0].filename}`;
      }
      if (req.files["images"] && req.files["images"].length > 0) {
        images = req.files["images"].map(
          (file) => `/uploads/${req.ngoName}/${file.filename}`
        );
      }
    }

    const project = await Project.create({
      title,
      description,
      content: finalContent,
      location,
      date,
      status,
      visibility,
      isFeatured,
      coverImage,
      pdfUrl,
      images,
      ngo: req.ngoId,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({ _id: id, createdBy: req.user.id });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found or unauthorized" });
    }

    const {
      title,
      description,
      content,
      location,
      date,
      status,
      visibility
    } = req.body;

    let finalContent = content !== undefined ? content : project.content;
    if (finalContent) {
      finalContent = sanitizeHtml(finalContent, sanitizeOptions);
    }

    if (title !== undefined)       project.title       = title;
    if (description !== undefined) project.description = description;
    if (location !== undefined)    project.location    = location;
    if (date !== undefined)        project.date        = date;
    if (status !== undefined)      project.status      = status;
    if (visibility !== undefined)  project.visibility  = visibility;
    project.content = finalContent;

    if (req.files) {
      if (req.files["coverImage"] && req.files["coverImage"][0]) {
        project.coverImage = `/uploads/${req.ngoName}/${req.files["coverImage"][0].filename}`;
      }
      if (req.files["pdfUrl"] && req.files["pdfUrl"][0]) {
        project.pdfUrl = `/uploads/${req.ngoName}/${req.files["pdfUrl"][0].filename}`;
      }
      if (req.files["images"] && req.files["images"].length > 0) {
        project.images = req.files["images"].map(
          (file) => `/uploads/${req.ngoName}/${file.filename}`
        );
      }
    }

    await project.save();

    res.json({
      success: true,
      message: "Project updated successfully",
      data: project
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {
      ngo: req.ngo,
      visibility: "public"
    };

    if (status) {
      filter.status = status;
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getSingleProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.ngo) {
      return res.status(400).json({
        success: false,
        message: "NGO context not found"
      });
    }

    const project = await Project.findOne({
      _id: id,
      ngo: req.ngo,
      visibility: "public"
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    project.views = (project.views || 0) + 1;
    await project.save();

    res.json({
      success: true,
      data: project
    });

  } catch (error) {
    console.error("Get Single Project Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      createdBy: req.user.id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      _id: id,
      createdBy: req.user.id
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found or unauthorized"
      });
    }

    if (project.coverImage) {
      const imgPath = path.join("public", project.coverImage);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    if (project.pdfUrl) {
      const pdfPath = path.join("public", project.pdfUrl);
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }

    // Delete all gallery images
    if (project.images && project.images.length > 0) {
      project.images.forEach(imgPath => {
        const fullPath = path.join("public", imgPath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }

    await Project.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Project deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};