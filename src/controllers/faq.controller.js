// controllers/faq.controller.js
import FAQ from "../models/faq.model.js";

export const createFAQ = async (req, res) => {
  try {
    console.log("=== Create FAQ Called by Superadmin ===");

    const { question, answer, category } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and Answer are required"
      });
    }

    const faq = await FAQ.create({
      question: question.trim(),
      answer: answer.trim(),
      category: category ? category.trim() : "General",
      ngo: req.ngoId,
      createdBy: req.user.id
    });

    console.log(" FAQ created successfully");

    res.status(201).json({
      success: true,
      message: "FAQ created successfully",
      data: faq
    });

  } catch (error) {
    console.error("Create FAQ Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getFAQs = async (req, res) => {
  try {
    console.log("=== GET FAQs Called for NGO:", req.ngoName);

    const faqs = await FAQ.find({
      ngo: req.ngoId,
      isActive: true
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: faqs.length,
      ngoName: req.ngoName,
      ngoCode: req.ngoCode,
      data: faqs
    });

  } catch (error) {
    console.error("Get FAQs Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const deleteFAQ = async (req, res) => {
  try {
    console.log("=== Delete FAQ Called ===");

    const { id } = req.params;

    const faq = await FAQ.findById(id);
    if (!faq) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }

    if (faq.ngo.toString() !== req.ngoId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete FAQs of selected NGO"
      });
    }

    await faq.deleteOne();

    console.log(" FAQ deleted successfully");

    res.json({
      success: true,
      message: "FAQ deleted successfully"
    });

  } catch (error) {
    console.error("Delete FAQ Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateFAQ = async (req, res) => {
  try {
    console.log("=== Update FAQ Called ===");

    const { id } = req.params;
    const { question, answer, category, isActive } = req.body;

    // Find FAQ
    const faq = await FAQ.findById(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found"
      });
    }

    if (faq.ngo.toString() !== req.ngoId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update FAQs of selected NGO"
      });
    }

    if (question) faq.question = question.trim();
    if (answer) faq.answer = answer.trim();
    if (category) faq.category = category.trim();
    if (typeof isActive !== "undefined") faq.isActive = isActive;

    await faq.save();

    console.log(" FAQ updated successfully");

    res.json({
      success: true,
      message: "FAQ updated successfully",
      data: faq
    });

  } catch (error) {
    console.error("Update FAQ Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};