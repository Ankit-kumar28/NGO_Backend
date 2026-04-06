// controllers/csr.controller.js
import CSRForm from "../models/csrForm.model.js";

export const createCSRForm = async (req, res) => {
  try {
    const {
      name, email, mobile, altContact,
      company, address, activities,
      saplings, location, volunteering,
      date, message
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing: name, email"
      });
    }

    const csrForm = await CSRForm.create({
      name, email, mobile, altContact,
      company, address, activities,
      saplings, location, volunteering,
      date, message,
      ngo: req.ngo  // from ngoMiddleware
    });

    res.status(201).json({
      success: true,
      message: "CSR form submitted successfully",
      data: csrForm
    });

  } catch (error) {
    console.error("createCSRForm error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCSRForms = async (req, res) => {
  try {
    const { status, volunteering, page = 1, limit = 10 } = req.query;

    const filter = { ngo: req.ngoId };

    if (status) filter.status = status;
    if (volunteering) filter.volunteering = volunteering;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [forms, total] = await Promise.all([
      CSRForm.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      CSRForm.countDocuments(filter)
    ]);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: forms
    });

  } catch (error) {
    console.error("getCSRForms error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateCSRStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["new", "contacted", "closed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowed.join(", ")}`
      });
    }

    const form = await CSRForm.findOneAndUpdate(
      { _id: id, ngo: req.user.ngoId },
      { status },
      { new: true }
    );

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "CSR form not found"
      });
    }

    res.json({
      success: true,
      message: "Status updated",
      data: form
    });

  } catch (error) {
    console.error("updateCSRStatus error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteCSRForm = async (req, res) => {
  try {
    const { id } = req.params;

    const form = await CSRForm.findOneAndDelete({
      _id: id,
      ngo: req.user.ngoId  // tenant-safe delete
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "CSR form not found"
      });
    }

    res.json({ success: true, message: "CSR form deleted" });

  } catch (error) {
    console.error("deleteCSRForm error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};