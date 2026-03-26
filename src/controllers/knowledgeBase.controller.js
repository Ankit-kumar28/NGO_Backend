import { knowledgeBase } from "../models/knowledgeBase.model.js";
import fs from "fs";
import path from "path";

export const createKnowledgeBase = async (req, res) => {
  try {
    console.log(" Creating knowledgeBase");

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

    const newKnowledgeBase  = await  knowledgeBase.create({
      title,
     
      description,
      
      keyTopics: keyTopics ? JSON.parse(keyTopics) : [],
      readTime,
      status,
      visibility,

      pdfUrl,
      

      ngo: req.ngoId,       
      author: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "knowledgeBase created successfully",
      data: newKnowledgeBase 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



export const getKnowledgeBase = async (req, res) => {
  try {
    const data = await KnowledgeBase.find({
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



export const getMyKnowledgeBase = async (req, res) => {
  try {
    const data = await KnowledgeBase.find({
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

    const qs = await KnowledgeBase.findOne({
      _id: id,
      author: req.user.id
    });

    if (!qs) {
      return res.status(404).json({
        message: "Not found or unauthorized"
      });
    }

    if (qs.coverImage) {
      const imgPath = path.join("public", qs.coverImage);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    if (qs.pdfUrl) {
      const pdfPath = path.join("public", qs.pdfUrl);
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