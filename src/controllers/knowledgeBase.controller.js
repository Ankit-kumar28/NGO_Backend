// controllers/knowledgeBase.controller.js
import { KnowledgeBase } from "../models/knowledgeBase.model.js";
import fs from "fs";
import path from "path";

const deleteFile = (filePath) => {
  if (!filePath) return;
  const abs = path.join("public", filePath);
  if (fs.existsSync(abs)) fs.unlinkSync(abs);
};

export const createKnowledgeBase = async (req, res) => {
  try {
    const {
      title,
      description,
      tag,
      highlights,
      readTime,
      order,
      tagColor,      
      status,
      visibility,
      isFeatured,
    } = req.body;

    if (!req.user || !req.ngoId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title || !description) {
      return res.status(400).json({
        message: "title and description are required",
      });
    }

    let parsedTagColor = {};
    if (tagColor) {
      try {
        parsedTagColor = typeof tagColor === "string"
          ? JSON.parse(tagColor)
          : tagColor;
      } catch {
        return res.status(400).json({ message: "Invalid tagColor format" });
      }
    }

    let pdfUrl     = "";
    let coverImage = "";

    if (req.file) {
      const filePath = `/uploads/${req.ngoName}/${req.file.filename}`;
      if (req.file.mimetype === "application/pdf") {
        pdfUrl = filePath;
      } else {
        coverImage = filePath;
      }
    }

    const kb = await KnowledgeBase.create({
      title,
      description,
      tag,
      tagColor: {
        pill:   parsedTagColor.pill   || "",
        dot:    parsedTagColor.dot    || "",
        text:   parsedTagColor.text   || "",
        border: parsedTagColor.border || "",
        hover:  parsedTagColor.hover  || "",
        accent: parsedTagColor.accent || "",
        light:  parsedTagColor.light  || "",
      },
      highlights:  highlights ? JSON.parse(highlights) : [],
      readTime:    readTime   ? Number(readTime)        : undefined,
      order:       order      ? Number(order)           : 0,
      pdfUrl,
      coverImage,
      status:      status     || "published",
      visibility:  visibility || "public",
      isFeatured:  isFeatured === "true" || isFeatured === true,
      ngo:         req.ngoId,
      createdBy:   req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Knowledge Base created successfully",
      data: kb,
    });

  } catch (error) {
    console.error("createKnowledgeBase:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateKnowledgeBase = async (req, res) => {
  try {
    const kb = await KnowledgeBase.findOne({
      _id: req.params.id,
      ngo: req.ngoId,
    });

    if (!kb) {
      return res.status(404).json({ message: "Not found or unauthorized" });
    }

    const {
      title, description, tag, highlights,
      readTime, order, status, visibility, isFeatured,
      tagColorPill, tagColorDot, tagColorText,
      tagColorBorder, tagColorHover, tagColorAccent, tagColorLight,
    } = req.body;

    if (req.file) {
      const filePath = `/uploads/${req.ngoName}/${req.file.filename}`;
      if (req.file.mimetype === "application/pdf") {
        deleteFile(kb.pdfUrl);
        kb.pdfUrl = filePath;
      } else {
        deleteFile(kb.coverImage);
        kb.coverImage = filePath;
      }
    }

    if (title)       kb.title       = title;

    if (description) kb.description = description;
    if (tag)         kb.tag         = tag;
    if (highlights)  kb.highlights  = JSON.parse(highlights);
    if (readTime  !== undefined) kb.readTime  = Number(readTime);
    if (order     !== undefined) kb.order     = Number(order);
    if (status)      kb.status      = status;
    if (visibility)  kb.visibility  = visibility;
    if (isFeatured !== undefined)
      kb.isFeatured = isFeatured === "true" || isFeatured === true;

    if (tagColorPill)   kb.tagColor.pill   = tagColorPill;
    if (tagColorDot)    kb.tagColor.dot    = tagColorDot;
    if (tagColorText)   kb.tagColor.text   = tagColorText;
    if (tagColorBorder) kb.tagColor.border = tagColorBorder;
    if (tagColorHover)  kb.tagColor.hover  = tagColorHover;
    if (tagColorAccent) kb.tagColor.accent = tagColorAccent;
    if (tagColorLight)  kb.tagColor.light  = tagColorLight;

    await kb.save();

    res.json({ success: true, message: "Updated successfully", data: kb });

  } catch (error) {
    console.error("updateKnowledgeBase:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getKnowledgeBase = async (req, res) => {
  try {
    const filter = {
      ngo:        req.ngo,          
      visibility: "public",
      status:     "published",
    };

    if (req.query.tag) filter.tag = req.query.tag;

    const data = await KnowledgeBase
      .find(filter)
      .select("-createdBy -__v");
      

    res.json({ success: true, count: data.length, data });

  } catch (error) {
    console.error("getKnowledgeBase:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSingleKnowledgeBase = async (req, res) => {
  try {
    const kb = await KnowledgeBase.findOneAndUpdate(
      {
        _id:        req.params.id,
        ngo:        req.ngo,
        visibility: "public",
        status:     "published",
      },
      { $inc: { views: 1 } },      
      { new: true }
    ).select("-createdBy -__v");

    if (!kb) {
      return res.status(404).json({ message: "Knowledge Base not found" });
    }

    res.json({ success: true, data: kb });

  } catch (error) {
    console.error("getSingleKnowledgeBase:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyKnowledgeBase = async (req, res) => {
  try {
    const filter = { ngo: req.ngoId };   

    if (req.query.status)     filter.status     = req.query.status;
    if (req.query.visibility) filter.visibility = req.query.visibility;
    if (req.query.tag)        filter.tag        = req.query.tag;

    const data = await KnowledgeBase
      .find(filter)
      .sort({ order: 1, createdAt: -1 });

    res.json({ success: true, count: data.length, data });

  } catch (error) {
    console.error("getMyKnowledgeBase:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteKnowledgeBase = async (req, res) => {
  try {
    const kb = await KnowledgeBase.findOne({
      _id:  req.params.id,
      ngo:  req.ngoId,               
    });

    if (!kb) {
      return res.status(404).json({ message: "Not found or unauthorized" });
    }

    deleteFile(kb.coverImage);
    deleteFile(kb.pdfUrl);

    await KnowledgeBase.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Deleted successfully" });

  } catch (error) {
    console.error("deleteKnowledgeBase:", error);
    res.status(500).json({ message: "Server error" });
  }
};