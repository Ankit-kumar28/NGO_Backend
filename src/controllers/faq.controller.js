// controllers/faq.controller.js
import FAQ from "../models/faq.model.js";

export const createFAQ = async (req, res) => {
  try {
    console.log("👉 Create FAQ API called");

    const { question, answer, category } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and Answer are required"
      });
    }

    // Security: Use NGO from JWT only (most secure)
    const faq = await FAQ.create({
      question: question.trim(),
      answer: answer.trim(),
      category: category ? category.trim() : "General",
      ngo: req.ngoId,           
      createdBy: req.user.id
    });

    console.log(" FAQ created for ngoId:", req.ngoId);

    res.status(201).json({
      success: true,
      message: "FAQ created successfully",
      data: faq
    });

  } catch (error) {
    console.error("Create FAQ Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// controllers/faq.controller.js

export const getFAQs = async (req, res) => {
  try {
    console.log("👉 GET FAQ API called");

    // 🔥 NGO comes from middleware
    const ngoId = req.ngo;

    const faqs = await FAQ.find({
      ngo: ngoId,
      isActive: true
    }).sort({ createdAt: -1 });

    console.log("✅ FAQs fetched for NGO:", ngoId);

    res.json({
      success: true,
      count: faqs.length,
      data: faqs
    });

  } catch (error) {
    console.error("Get FAQ Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const deleteFAQ = async (req, res) => {
  try {
    console.log("👉 DELETE FAQ API called");

    const { id } = req.params;

    // Find FAQ
    const faq = await FAQ.findById(id);
    console.log("👉 FAQ:", faq);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found"
      });
    }


    if (faq.ngo.toString() !== req.user.ngoId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your NGO FAQs"
      });
    }

    await faq.deleteOne();

    console.log(" FAQ deleted successfully:", id);

    res.json({
      success: true,
      message: "FAQ deleted successfully"
    });

  } catch (error) {
    console.error("Delete FAQ Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};