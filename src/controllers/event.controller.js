import { Event } from "../models/event.model.js";
import fs from "fs";
import path from "path";

// ================= CREATE EVENT =================
export const createEvent = async (req, res) => {
  try {
    console.log("👉 Creating Event");

    const {
      title,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      registrationLink,
      location,
      city,
      state,
      status,
      visibility,
      isFeatured,
      tags
    } = req.body;

    let posterImage = "";
    let pdfUrl = "";

    if (req.file) {
      const filePath = `/uploads/${req.ngoName}/${req.file.filename}`;

      if (req.file.mimetype === "application/pdf") {
        pdfUrl = filePath;
      } else {
        posterImage = filePath;
      }
    }

    const event = await Event.create({
      title,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      registrationLink,
      location,
      city,
      state,
      status,
      visibility,
      isFeatured,
      tags: tags ? JSON.parse(tags) : [],
      ngo: req.ngoId,
      createdBy: req.user.id,
      posterImage,
      pdfUrl
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// ================= PUBLIC EVENTS =================
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({
      ngo: req.ngo,
      visibility: "public"
    }).sort({ startDate: -1 });

    res.json({
      success: true,
      count: events.length,
      data: events
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ NEW: GET SINGLE EVENT
export const getSingleEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.ngo) {
      return res.status(400).json({
        success: false,
        message: "NGO context not found"
      });
    }

    const event = await Event.findOne({
      _id: id,
      ngo: req.ngo,
      visibility: "public"
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    // Increment views
    event.views = (event.views || 0) + 1;
    await event.save();

    res.json({
      success: true,
      data: event
    });

  } catch (error) {
    console.error("Get Single Event Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ================= ADMIN EVENTS =================
export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      createdBy: req.user.id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: events.length,
      data: events
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE EVENT =================
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({
      _id: id,
      createdBy: req.user.id
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found or unauthorized"
      });
    }

    if (event.posterImage) {
      const imgPath = path.join("public", event.posterImage);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    if (event.pdfUrl) {
      const pdfPath = path.join("public", event.pdfUrl);
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }

    await Event.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Event deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};