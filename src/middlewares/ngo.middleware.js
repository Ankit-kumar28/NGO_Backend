import NGO from "../models/ngo.model.js";

export const ngoMiddleware = async (req, res, next) => {
  try {
    console.log("=== NGO Middleware Triggered ===");

    const ngoIdentifier = req.headers["x-ngo-id"];

    console.log("x-ngo-id received:", ngoIdentifier);

    if (!ngoIdentifier) {
      console.log("Missing x-ngo-id header");
      return res.status(400).json({
        success: false,
        message: "x-ngo-id header is required"
      });
    }

    let ngo;

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(ngoIdentifier);

    if (isObjectId) {
      ngo = await NGO.findById(ngoIdentifier);
    } else {
      ngo = await NGO.findOne({ code: ngoIdentifier });
    }

    if (!ngo) {
      console.log(" Invalid NGO:", ngoIdentifier);
      return res.status(404).json({
        success: false,
        message: "Invalid NGO"
      });
    }

    if (!ngo.isActive) {
      return res.status(403).json({
        success: false,
        message: "NGO is inactive"
      });
    }

    req.ngo = ngo;
    req.ngoId = ngo._id;
    req.ngoCode = ngo.code;
    req.ngoName = ngo.name;

    console.log(`NGO Access Granted: ${ngo.name} (${ngo.code})`);

    next();

  } catch (error) {
    console.error("NGO Middleware Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error in NGO middleware"
    });
  }
};