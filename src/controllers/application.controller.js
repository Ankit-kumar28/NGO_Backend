import Application from "../models/application.model.js";
import GetInvolved from "../models/getInvolved.model.js";

export const applyApplication = async (req, res) => {
  try {
    const { opportunityId, name, email, phone, data } = req.body;

    if (!req.ngoId) {
      return res.status(401).json({
        success: false,
        message: "NGO identifier not found"
      });
    }

    if (!opportunityId || !name || !email) {
      return res.status(400).json({
        success: false,
        message: "opportunityId, name and email are required"
      });
    }

    const opportunity = await GetInvolved.findOne({
      _id: opportunityId,
      ngo: req.ngoId,
      isActive: true
    });

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: "Opportunity not found or inactive"
      });
    }

    if (opportunity.applicationMode === "external") {
      return res.json({
        success: false,
        type: "external",
        redirectUrl: opportunity.externalLink
      });
    }

    const application = await Application.create({
      ngo: req.ngoId,
      opportunity: opportunity._id,
      type: opportunity.type,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || null,
      data: data || {}
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application
    });

  } catch (error) {
    console.error("Apply Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getApplications = async (req, res) => {
  try {
    const { type, status } = req.query;

    let filter = {
      ngo: req.ngoId
    };

    if (type) filter.type = type;
    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .populate("opportunity", "title type")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findOneAndUpdate(
      { _id: id, ngo: req.ngoId },
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    res.json({
      success: true,
      data: application
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};