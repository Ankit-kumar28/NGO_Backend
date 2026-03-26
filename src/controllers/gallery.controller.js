// controllers/gallery.controller.js
import User from "../models/user.model.js";

import { Gallery } from "../models/gallery.model.js";
import path from 'path';
import fs from 'fs';

export const createGallery = async (req, res) => {
  try {
    console.log(" Upload Gallery");

    const { title, description, mediaType } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "File required"
      });
    }

    const filePath = `/${req.file.filename}`;

    const gallery = await Gallery.create({
      title,
      description,
      mediaType,
      mediaUrl: filePath,
      
      ngo: req.ngoId,          
      uploadedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: gallery
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getGallery = async (req, res) => {
  try {
    console.log("Fetch gallery for NGO:", req.ngoName);

    const gallery = await Gallery.find({ ngo: req.ngo })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      ngo: req.ngoName,
      count: gallery.length,
      data: gallery
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getMyGallery = async (req, res) => {
  try {
    console.log("Admin fetching own uploads:", req.user.id);
    const user = await User.findById(req.user.id);
    console.log(" Admin:", user.name);
    const gallery = await Gallery.find({
      uploadedBy: req.user.id   
    })
      .sort({ createdAt: -1 })
      .populate("ngo", "name code");

    res.status(200).json({
      success: true,
      count: gallery.length,
      data: gallery
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const deleteMyGallery = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(" Delete request by:", req.user.id);

   
    const gallery = await Gallery.findOne({
      _id: id,
      uploadedBy: req.user.id
    });

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found or not authorized"
      });
    }

    const ngoFolderName = req.ngoName || "default";

    console.log(ngoFolderName )

console.log(gallery.mediaUrl)
      const filePath = path.join(`public/uploads/${ngoFolderName}`,gallery.mediaUrl);

    console.log("File path:", filePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(" File deleted");
    } else {
      console.log(" File not found in folder");
    }

    await Gallery.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Gallery deleted successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};