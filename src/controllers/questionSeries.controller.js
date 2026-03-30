// controllers/questionSeries.controller.js

import { QuestionSeries } from "../models/questionSeries.model.js";
import fs from "fs";
import path from "path";

const deleteFile = (filePath) => {
  if (!filePath) return;
  const abs = path.join("public", filePath);
  if (fs.existsSync(abs)) fs.unlinkSync(abs);
};

export const createQuestionSeries = async (req, res) => {
  try {
    const {
      // required
      title,
      description,
      seriesType,
      code,
      // optional content
      subtitle,
      tag,
      tagLine,
      audience,
      level,
      highlights,   
      icon,
      readTime,     
      order,
     
      tagColorAccent,
      tagColorLight,
      tagColorPill,
     
      status,
      visibility,
      isFeatured,
    } = req.body;

    if (!req.user || !req.ngoId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!title || !description || !seriesType || !code) {
      return res.status(400).json({
        message: "title, description, seriesType and code are required",
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
    
    const questionSeries = await QuestionSeries.create({
      title,
      subtitle,
      description,
      seriesType,
      code,                                           
      tag,
      tagLine,
      tagColor: {
        accent: tagColorAccent,
        light:  tagColorLight,
        pill:   tagColorPill,
      },
      audience,
      level,
      highlights: highlights ? JSON.parse(highlights) : [],
      icon,
      readTime:   readTime ? Number(readTime) : undefined,
      order:      order    ? Number(order)    : 0,
      pdfUrl,
      coverImage,
      status:     status     || "published",
      visibility: visibility || "public",
      isFeatured: isFeatured === "true" || isFeatured === true,
      ngo:        req.ngoId,
      createdBy:  req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Question Series created successfully",
      data: questionSeries,
    });

  } catch (error) {
    // Duplicate code → friendly message
    // if (error.code === 11000) {
    //   return res.status(409).json({
    //     message: `A series with code "${req.body.code}" already exists`,
    //   });
    // }
    console.error("createQuestionSeries:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateQuestionSeries = async (req, res) => {
  try {
    const { id } = req.params;

    const qs = await QuestionSeries.findOne({ _id: id, ngo: req.ngoId });
    if (!qs) {
      return res.status(404).json({ message: "Not found or unauthorized" });
    }

    const {
      title, subtitle, description, seriesType, code,
      tag, tagLine, audience, level, highlights,
      icon, readTime, order,
      tagColorAccent, tagColorLight, tagColorPill,
      status, visibility, isFeatured,
    } = req.body;

    if (req.file) {
      const filePath = `/uploads/${req.ngoName}/${req.file.filename}`;
      if (req.file.mimetype === "application/pdf") {
        deleteFile(qs.pdfUrl);         
        qs.pdfUrl = filePath;
      } else {
        deleteFile(qs.coverImage);      
        qs.coverImage = filePath;
      }
    }

    if (title)       qs.title       = title;
    if (subtitle)    qs.subtitle    = subtitle;
    if (description) qs.description = description;
    if (seriesType)  qs.seriesType  = seriesType;
    if (code)        qs.code        = code;
    if (tag)         qs.tag         = tag;
    if (tagLine)     qs.tagLine     = tagLine;
    if (audience)    qs.audience    = audience;
    if (level)       qs.level       = level;
    if (icon)        qs.icon        = icon;
    if (readTime  !== undefined) qs.readTime  = Number(readTime);
    if (order     !== undefined) qs.order     = Number(order);
    if (status)      qs.status      = status;
    if (visibility)  qs.visibility  = visibility;
    if (isFeatured !== undefined)
      qs.isFeatured = isFeatured === "true" || isFeatured === true;

    if (highlights) qs.highlights = JSON.parse(highlights);

    if (tagColorAccent) qs.tagColor.accent = tagColorAccent;
    if (tagColorLight)  qs.tagColor.light  = tagColorLight;
    if (tagColorPill)   qs.tagColor.pill   = tagColorPill;

    await qs.save();

    res.json({ success: true, message: "Updated successfully", data: qs });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: `Code "${req.body.code}" is already used by another series`,
      });
    }
    console.error("updateQuestionSeries:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getQuestionSeries = async (req, res) => {
  try {
    const filter = {
      ngo:        req.ngo,          
      visibility: "public",
      status:     "published",
    };

    if (req.query.seriesType) {
      filter.seriesType = req.query.seriesType;
    }

    const data = await QuestionSeries
      .find(filter)
      .select("-createdBy -__v")  
      .sort({ order: 1, createdAt: -1 });

    res.json({ success: true, count: data.length, data });

  } catch (error) {
    console.error("getQuestionSeries:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSingleQuestionSeries = async (req, res) => {
  try {
    const qs = await QuestionSeries.findOneAndUpdate(
      {
        _id:        req.params.id,
        ngo:        req.ngo,          
        visibility: "public",
        status:     "published",
      },
      { $inc: { views: 1 } },        
      { new: true }
    ).select("-createdBy -__v");

    if (!qs) {
      return res.status(404).json({ message: "Question Series not found" });
    }

    res.json({ success: true, data: qs });

  } catch (error) {
    console.error("getSingleQuestionSeries:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyQuestionSeries = async (req, res) => {
  try {
    const filter = { ngo: req.ngoId };  

    // Optional filters from query
    if (req.query.status)     filter.status     = req.query.status;
    if (req.query.visibility) filter.visibility = req.query.visibility;
    if (req.query.seriesType) filter.seriesType = req.query.seriesType;

    const data = await QuestionSeries
      .find(filter)
      .sort({ order: 1, createdAt: -1 });

    res.json({ success: true, count: data.length, data });

  } catch (error) {
    console.error("getMyQuestionSeries:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteQuestionSeries = async (req, res) => {
  try {
    const qs = await QuestionSeries.findOne({
      _id: req.params.id,
      ngo: req.ngoId,             
    });

    if (!qs) {
      return res.status(404).json({ message: "Not found or unauthorized" });
    }

   
    deleteFile(qs.coverImage);
    deleteFile(qs.pdfUrl);

    await QuestionSeries.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Deleted successfully" });

  } catch (error) {
    console.error("deleteQuestionSeries:", error);
    res.status(500).json({ message: "Server error" });
  }
};