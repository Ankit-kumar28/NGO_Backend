import { Gallery } from "../models/gallery.model.js";
import path from 'path';
import fs from 'fs';


export const createGallery = async (req, res) => {
  try {
    console.log("=== CREATE GALLERY API Called ===");

    const { title, description, mediaType } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required"
      });
    }

    const filePath = `/uploads/${req.ngoName || "default"}/${req.file.filename}`;

    const gallery = await Gallery.create({
      title: title?.trim(),
      description: description?.trim(),
      mediaType,
      mediaUrl: filePath,
      ngo: req.ngoId,
      uploadedBy: req.user?.id
    });

    console.log(" Gallery created successfully");

    res.status(201).json({
      success: true,
      message: "Gallery created successfully",
      data: gallery
    });

  } catch (error) {
    console.error("Create Gallery Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getGallery = async (req, res) => {
  try {
    console.log("=== GET GALLERY API Called for:", req.ngoName);

    const gallery = await Gallery.find({ 
      ngo: req.ngoId 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      ngoName: req.ngoName,
      ngoCode: req.ngoCode,
      count: gallery.length,
      data: gallery
    });

  } catch (error) {
    console.error("Get Gallery Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const updateGallery = async (req, res) => {
  try {
    console.log("=== PATCH GALLERY API Called ===");

    const { id } = req.params;
    const { title, description, mediaType } = req.body;

    const galleryItem = await Gallery.findById(id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found"
      });
    }

    if (galleryItem.ngo.toString() !== req.ngoId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update items of the selected NGO"
      });
    }

    let newMediaUrl = galleryItem.mediaUrl;

    if (req.file) {
      
      if (galleryItem.mediaUrl) {
        const oldFilePath = path.join(process.cwd(), galleryItem.mediaUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log("Old file deleted");
        }
      }
      newMediaUrl = `/uploads/${req.ngoName || "default"}/${req.file.filename}`;
    }

    const updatedGallery = await Gallery.findByIdAndUpdate(
      id,
      {
        title: title?.trim() || galleryItem.title,
        description: description?.trim() || galleryItem.description,
        mediaType: mediaType || galleryItem.mediaType,
        mediaUrl: newMediaUrl
      },
      { new: true }
    );

    console.log(" Gallery updated successfully");

    res.json({
      success: true,
      message: "Gallery updated successfully",
      data: updatedGallery
    });

  } catch (error) {
    console.error("Update Gallery Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const deleteGallery = async (req, res) => {
  try {
    console.log("=== DELETE GALLERY API Called ===");

    const { id } = req.params;

    const galleryItem = await Gallery.findById(id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found"
      });
    }

    if (galleryItem.ngo.toString() !== req.ngoId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete items of the selected NGO"
      });
    }

    if (galleryItem.mediaUrl) {
      const filePath = path.join(process.cwd(), galleryItem.mediaUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await galleryItem.deleteOne();

    console.log("Gallery item deleted successfully");

    res.json({
      success: true,
      message: "Gallery item deleted successfully"
    });

  } catch (error) {
    console.error("Delete Gallery Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};