import NGO from "../models/ngo.model.js";

export const ngoMiddleware = async (req, res, next) => {
  try {
    console.log(" NGO Middleware triggered");

    //  Get NGO code from header
    const ngoCode = req.headers["x-ngo-id"];
    console.log(" Received NGO Code:", ngoCode);

    //  Check if header exists
    if (!ngoCode) {
      console.log("NGO code missing in headers");
      return res.status(400).json({
        success: false,
        message: "NGO code (x-ngo-id) is required"
      });
    }

    //  Find NGO in DB using code
    const ngo = await NGO.findOne({ code: ngoCode });

    console.log(" NGO found in DB:", ngo);

    //  If NGO not found
    if (!ngo) {
      console.log(" Invalid NGO code");
      return res.status(404).json({
        success: false,
        message: "Invalid NGO"
      });
    }

    //  Check if NGO is active
    if (!ngo.isActive) {
      console.log(" NGO is inactive");
      return res.status(403).json({
        success: false,
        message: "NGO is inactive"
      });
    }

    //  Attach NGO ID to request (VERY IMPORTANT )
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