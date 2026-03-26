import { Event } from "../models/event.model.js";

// ================= CREATE EVENT =================
export const createEvent = async (req, res) => {
  try {
    console.log("👉 Creating Event");

    const {
      title,
      description,
    
      startTime,
      endTime,
      registrationLink,
     
    } = req.body;

    let posterImage = "";
    let pdfUrl = "";

    // 🔥 FILE HANDLING
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
      
     
      startTime,
      endTime,
      registrationLink,
     
      ngo: req.ngoId,          // 🔥 multi-tenant
      createdBy: req.user.id   // 🔥 admin
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
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

import fs from "fs";
import path from "path";

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

    // 🔥 DELETE POSTER
    if (event.posterImage) {
      const imgPath = path.join("public", event.posterImage);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    // 🔥 DELETE PDF
    if (event.pdfUrl) {
      const pdfPath = path.join("public", event.pdfUrl);
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
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