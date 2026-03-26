import User from "../models/user.model.js";
import NGO from "../models/ngo.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, ngoCode } = req.body;

    if (!name || !email || !password || !ngoCode) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and ngoCode are required"
      });
    }

    const ngo = await NGO.findOne({ code: ngoCode });
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: "Invalid NGO code"
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "admin",
      ngo: ngo._id
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ngoId: ngo._id,
        ngoCode: ngo.code
      }
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() })
                          .populate("ngo", "code name");   // ← Good practice

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

  
    const token = jwt.sign(
  {
    id: user._id,
    role: user.role,
    ngoId: user.ngo._id,
    ngoCode: user.ngo.code,
    ngoName: user.ngo.name   
  },
  process.env.SECRET_KEY,
  { expiresIn: "1d" }
);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ngoId: user.ngo._id,
        ngoCode: user.ngo.code,
        ngoName: user.ngo.name
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};