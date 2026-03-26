import { Project } from "../models/project.model.js";

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

    let images = "";
    let pdfUrl = "";

    if (req.file) {
      const filePath = `/uploads/${req.ngoName}/${req.file.filename}`;

      if (req.file.mimetype === "application/pdf") {
        pdfUrl = filePath;
      } else {
        images = filePath;
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
      images,
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
    res.status(500).json({ message: error.message });
  }
};


export const getProjects = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {
      ngo: req.ngoId,
      visibility: "public"
    };

    if (status) {
      filter.status = status;
    }

    const data = await Project.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getSingleProject = async (req, res) => {
  try {
    const { slug } = req.params;

    const project = await Project.findOne({
      slug,
      ngo: req.ngoId,
      visibility: "public"
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }
    project.views += 1;
    await project.save();

    res.json({
      success: true,
      data: project
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const data = await Project.find({
      createdBy: req.user.id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

import fs from "fs";
import path from "path";

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      _id: id,
      createdBy: req.user.id
    });

    if (!project) {
      return res.status(404).json({
        message: "Not found or unauthorized"
      });
    }

    if (project.coverImage) {
      const imgPath = path.join("public", project.coverImage);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    if (project.pdfUrl) {
      const pdfPath = path.join("public", project.pdfUrl);
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }

    await Project.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Project deleted"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};