// controllers/contact.controller.js
import Contact from "../models/contact.model.js";

export const createContact = async (req, res) => {
  try {
    console.log("Create Contact API called");

    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject and message are required"
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      ngo: req.ngo,           
      status: "pending"
    });

    console.log("Contact saved for NGO:", req.ngo);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact
    });
  } catch (error) {
    console.error("Create Contact Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while saving contact"
    });
  }
};

export const getContacts = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = { ngo: req.ngoId };

    if (status) {
      filter.status = status;
    }

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      
    res.json({
      success: true,
      count: contacts.length,
      ngoName: req.ngoName,
      ngoCode: req.ngoCode,
      data: contacts
    });
  } catch (error) {
    console.error("Get Contacts Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      ngo: req.ngoId
    }).populate('repliedBy', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found"
      });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error("Get Contact By ID Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    const allowedStatuses = ["pending", "read", "replied", "closed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`
      });
    }

    const contact = await Contact.findOneAndUpdate(
      { 
        _id: req.params.id,
        ngo: req.ngoId 
      },
      { 
        status,
        updatedAt: Date.now()
      },
      { 
        new: true,          
        runValidators: true 
      }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found or you don't have permission to update it"
      });
    }

    res.json({
      success: true,
      message: `Contact status updated to "${status}" successfully`,
      data: contact
    });
  } catch (error) {
    console.error("Update Contact Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating contact status"
    });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete({
      _id: req.params.id,
      ngo: req.ngoId
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found or access denied"
      });
    }

    res.json({
      success: true,
      message: "Contact deleted successfully"
    });
  } catch (error) {
    console.error("Delete Contact Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting contact"
    });
  }
};