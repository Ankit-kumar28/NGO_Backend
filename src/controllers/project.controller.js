import { Project } from "../models/project.model.js";
import fs from "fs";
import path from "path";

export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      location,
      startDate,
      endDate,
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

    const project = await Project.create({
      title,
      description,
      content,
      location,
      startDate,
      endDate,
      status,
      visibility,
      coverImage,
      pdfUrl,
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

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 });

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

    await Project.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Project deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};