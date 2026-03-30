// controllers/getInvolved.controller.js
import GetInvolved from "../models/getInvolved.model.js";
import path from "path";

export const createGetInvolved = async (req, res) => {
  try {
    const {
      type, name, email, phone,
      profession, message,
      
      membershipType, otherMembershipType,
     
      area,
    
      college
    } = req.body;
    const allowedTypes = ["membership", "volunteer", "internship"];
    if (!type || !allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `type is required. Allowed: ${allowedTypes.join(", ")}`
      });
    }

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "name and email are required"
      });
    }

    if (type === "membership" && !membershipType) {
      return res.status(400).json({
        success: false,
        message: "membershipType is required for membership form"
      });
    }

    if (type === "volunteer" && !area) {
      return res.status(400).json({
        success: false,
        message: "area is required for volunteer form"
      });
    }

    if (type === "internship" && !college) {
      return res.status(400).json({
        success: false,
        message: "college is required for internship form"
      });
    }

    let resumePath = undefined;
    if (type === "internship") {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Resume file is required for internship form"
        });
      }
      resumePath = `/uploads/${req.ngoName || "default"}/${req.file.filename}`; 
    }

    const entry = await GetInvolved.create({
      type, name, email, phone,
      profession, message,
      membershipType, otherMembershipType,
      area,
      college, resumePath,
      ngo: req.ngo 
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: entry
    });

  } catch (error) {
    console.error("createGetInvolved error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getGetInvolved = async (req, res) => {
  try {
    const { type, status, page = 1, limit = 10 } = req.query;

    const filter = { ngo: req.user.ngoId };

    if (type) {
      const allowedTypes = ["membership", "volunteer", "internship"];
      if (!allowedTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          message: `Invalid type. Allowed: ${allowedTypes.join(", ")}`
        });
      }
      filter.type = type;
    }

    if (status) {
      const allowedStatus = ["new", "reviewed", "accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Allowed: ${allowedStatus.join(", ")}`
        });
      }
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [entries, total] = await Promise.all([
      GetInvolved.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      GetInvolved.countDocuments(filter)
    ]);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: entries
    });

  } catch (error) {
    console.error("getGetInvolved error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["new", "reviewed", "accepted", "rejected"];
    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowedStatus.join(", ")}`
      });
    }

    const entry = await GetInvolved.findOneAndUpdate(
      { _id: id, ngo: req.user.ngoId }, 
      { status },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Application not found"
      });
    }

    res.json({
      success: true,
      message: "Status updated",
      data: entry
    });

  } catch (error) {
    console.error("updateStatus error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};