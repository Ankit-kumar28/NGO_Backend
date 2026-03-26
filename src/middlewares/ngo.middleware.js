import NGO from "../models/ngo.model.js";

export const ngoMiddleware = async (req, res, next) => {
  try {
    console.log(" NGO Middleware triggered");

   
    const ngoCode = req.headers["x-ngo-id"];
    console.log(" Received NGO Code:", ngoCode);

   
    if (!ngoCode) {
      console.log("NGO code missing in headers");
      return res.status(400).json({
        success: false,
        message: "NGO code (x-ngo-id) is required"
      });
    }

   
    const ngo = await NGO.findOne({ code: ngoCode });

    console.log(" NGO found in DB:", ngo);

    
    if (!ngo) {
      console.log(" Invalid NGO code");
      return res.status(404).json({
        success: false,
        message: "Invalid NGO"
      });
    }

    if (!ngo.isActive) {
      console.log(" NGO is inactive");
      return res.status(403).json({
        success: false,
        message: "NGO is inactive"
      });
    }

      req.ngo = ngo;
      req.ngoId = ngo._id;
    req.ngoCode = ngo.code;
    req.ngoName = ngo.name;

    console.log("req.ngo set to:", req.ngo);

  
    next();

  } catch (error) {
    console.error(" NGO Middleware Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error in NGO Middleware"
    });
  }
};