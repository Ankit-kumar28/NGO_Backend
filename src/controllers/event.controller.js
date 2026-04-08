import { Event } from "../models/event.model.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

export const createEvent = async (req, res) => {
  try {
    console.log("Creating Event");

    const {
      title,
      subtitle,
      topics,
      date,
      startTime,
      endTime,
      registrationLink,
      badge,
      badgeColor,
      month,
      year,
      visibility,
      isFeatured,
    } = req.body;

    let image = "";
    let pdfUrl = "";

    if (req.files) {
      
      if (req.files.image && req.files.image.length > 0) {
        const imageFile = req.files.image[0];
        image = `/uploads/${req.ngoName || "default"}/${imageFile.filename}`;
      }

      if (req.files.file && req.files.file.length > 0) {
        const pdfFile = req.files.file[0];
        pdfUrl = `/uploads/${req.ngoName || "default"}/${pdfFile.filename}`;
      }
    }

    let parsedTopics = [];
    if (topics) {
      try {
        parsedTopics = typeof topics === 'string' 
          ? JSON.parse(topics) 
          : topics;
      } catch (err) {
        console.warn("Failed to parse topics:", err.message);
        parsedTopics = [];
      }
    }

    const event = await Event.create({
      title,
      subtitle,
      topics: parsedTopics,
      date,
      startTime,
      endTime,
      registrationLink: registrationLink || "",
      badge,
      badgeColor,
      visibility: visibility || "public",
      isFeatured: isFeatured === "true" || isFeatured === true,
      ngo: req.ngoId,
      createdBy: req.user.id,
      image,
      pdfUrl,
      month: month ? Number(month) : new Date().getMonth() + 1,
      year: year ? Number(year) : new Date().getFullYear(),
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create event",
    });
  }
};
export const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const {
      title, subtitle, topics, date, startTime, endTime,
      registrationLink, badge, badgeColor, month, year,
      visibility, isFeatured
    } = req.body;

    let image = undefined;  
    let pdfUrl = undefined;

    if (req.files) {
      if (req.files.image && req.files.image.length > 0) {
        image = `/uploads/${req.ngoName || "default"}/${req.files.image[0].filename}`;
      }
      if (req.files.file && req.files.file.length > 0) {
        pdfUrl = `/uploads/${req.ngoName || "default"}/${req.files.file[0].filename}`;
      }
    }

    let parsedTopics = undefined;
    if (topics) {
      try {
        parsedTopics = typeof topics === 'string' ? JSON.parse(topics) : topics;
      } catch (err) {
        parsedTopics = [];
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        title,
        subtitle,
        topics: parsedTopics,
        date,
        startTime,
        endTime,
        registrationLink,
        badge,
        badgeColor,
        visibility,
        isFeatured: isFeatured === "true" || isFeatured === true,
        image,
        pdfUrl,
        month: month ? Number(month) : undefined,
        year: year ? Number(year) : undefined,
      },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update event",
    });
  }
};
export const getEvents = async (req, res) => {
  try {
    const { ngo } = req;

    if (!ngo) {
      return res.status(400).json({
        success: false,
        message: "NGO context not found",
      });
    }

    const events = await Event.find({ ngo, visibility: "public" })
      .select("-__v")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Get Events Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching events",
    });
  }
};

export const getSingleEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { ngo } = req;

    if (!ngo) {
      return res.status(400).json({
        success: false,
        message: "NGO context not found",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    const event = await Event.findOne({ _id: id, ngo, visibility: "public" });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Get Single Event Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.id })
      .select("-__v")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Get My Events Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({ _id: id, createdBy: req.user.id });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found or unauthorized",
      });
    }

    const deleteFile = (filePath) => {
      if (!filePath) return;
      const fullPath = path.join("public", filePath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          console.log(`Deleted file: ${fullPath}`);
        } catch (err) {
          console.warn(`Failed to delete file ${fullPath}:`, err.message);
        }
      }
    };

    deleteFile(event.image);
    deleteFile(event.pdfUrl);

    await Event.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete Event Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting event",
    });
  }
};