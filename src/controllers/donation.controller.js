import Donation from "../models/donation.model.js";

export const createDonation = async (req, res) => {
  try {
    console.log(" New Donation");

    const {
      name,
      email,
      phone,
      amount,
      transactionId,
      paymentMethod,
      message
    } = req.body;

    if (!name || !email || !phone || !amount || !transactionId || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled"
      });
    }

    const donation = await Donation.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone,
      amount,
      transactionId,
      paymentMethod,
      message,
      ngo: req.ngo   
    });

    res.status(201).json({
      success: true,
      message: "Donation successful",
      data: donation
    });

  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate transaction detected"
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getDonations = async (req, res) => {
  try {
    console.log(" Admin fetching donations");

    const donations = await Donation.find({
      ngo: req.ngoId  
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: donations.length,
      data: donations
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    const donation = await Donation.findOne({
      _id: id,
      ngo: req.ngoId 
    });

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found"
      });
    }

    donation.status = status;
    donation.verifiedBy = req.user.id;
    donation.verifiedAt = new Date();

    await donation.save();

    res.json({
      success: true,
      message: "Donation status updated",
      data: donation
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const checkDonationStatus = async (req, res) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({
        message: "Phone number required"
      });
    }

    const donations = await Donation.find({
      phone,
      ngo: req.ngo  
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: donations.length,
      data: donations
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};