// controllers/contact.controller.js

import Contact from "../models/contact.model.js";

export const createContact = async (req, res) => {
  try {
    console.log("👉 Create Contact API called");

    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All required fields missing"
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      ngo: req.ngo   
    });

    console.log("Contact saved for NGO:", req.ngo);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data:contact
    });

  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getContacts = async (req, res) => {
  try {
    
    // const contacts = await Contact.find({
    //   ngo: req.user.ngo
    // });

    const contacts = await Contact.find({ ngo: req.user.ngoId });
    console.log("📦 contacts found:", contacts.length);

    res.json({
      success: true,
      data: contacts
    });

  } catch (error) {
    console.error("Get Contacts Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};