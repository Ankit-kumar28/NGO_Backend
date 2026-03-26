import { knowledgeBase } from "../models/knowledgeBase.model.js";
import fs from "fs";
import path from "path";

export const createKnowledgeBase = async (req, res) => {
  try {
    console.log("Creating knowledgeBase");

    const {
      title,
      description,
      keyTopics,
      readTime,
      status,
      visibility
    } = req.body;

    if (!req.user || !req.ngoId) {
      return res.status(400).json({
        message: "NGO or Admin not found"
      });
    }

    let pdfUrl = "";
    let coverImage = "";

    if (req.file) {
      const filePath = `/uploads/${req.ngoName}/${req.file.filename}`;

      if (req.file.mimetype === "application/pdf") {
        pdfUrl = filePath;
      } else {
        coverImage = filePath;
      }
    }

    const newKnowledgeBase = await knowledgeBase.create({
      title,
      description,
      keyTopics: keyTopics ? JSON.parse(keyTopics) : [],
      readTime,
      status,
      visibility,
      pdfUrl,
      coverImage,          
      ngo: req.ngoId,
      author: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Knowledge Base created successfully",
      data: newKnowledgeBase
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getKnowledgeBase = async (req, res) => {
  try {
    const data = await knowledgeBase.find({          
      ngo: req.ngo,
      visibility: "public",
      status: "published"
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};

export const getSingleKnowledgeBase = async (req, res) => {
  try {
    const { id } = req.params;

    
    const kb = await knowledgeBase.findOne({
      _id: id,
      ngo: req.ngo,
      visibility: "public",
      status: "published"
    });

    if (!kb) {
      return res.status(404).json({
        message: "Knowledge Base not found"
      });
    }

    kb.views = (kb.views || 0) + 1;
    await kb.save();

    res.json({
      success: true,
      data: kb
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

export const getMyKnowledgeBase = async (req, res) => {
  try {
    const data = await knowledgeBase.find({          
      author: req.user.id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteKnowledgeBase = async (req, res) => {
  try {
    const { id } = req.params;

    const kb = await knowledgeBase.findOne({         
      _id: id,
      author: req.user.id
    });

    if (!kb) {
      return res.status(404).json({
        message: "Not found or unauthorized"
      });
    }

    if (kb.coverImage) {
      const imgPath = path.join("public", kb.coverImage);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    if (kb.pdfUrl) {
      const pdfPath = path.join("public", kb.pdfUrl);
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }

    await knowledgeBase.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};