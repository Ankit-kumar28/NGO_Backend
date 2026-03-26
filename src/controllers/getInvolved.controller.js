import GetInvolved from "../models/getInvolved.model.js";

// ================= GET GET INVOLVED (Public - with filter) =================
export const getGetInvolved = async (req, res) => {
  try {
    const { type } = req.query;        // Get ?type=membership from query

    let filter = {
      ngo: req.ngo,
      isActive: true
    };

    // Filter by type if provided (membership, volunteer, internship)
    if (type) {
      filter.type = type;
    }

    const data = await GetInvolved.find(filter)
      .sort({ createdAt: -1 });   // You can change to "order" if you add order field later

    console.log("GetInvolved fetched for NGO:", req.ngo, "Type:", type);

    res.json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {
    console.error("Get GetInvolved Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

// ================= UPSERT GET INVOLVED =================
export const upsertGetInvolved = async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      keyPoints,
      applicationMode,
      externalLink
    } = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Type is required (membership, volunteer, or internship)"
      });
    }

    let image = "";

    if (req.file) {
      image = `/uploads/${req.ngoName}/${req.file.filename}`;
    }

    // Since you have unique index on (ngo + type), we can use findOneAndUpdate with upsert
    const data = await GetInvolved.findOneAndUpdate(
      { 
        ngo: req.ngoId, 
        type 
      },
      {
        ngo: req.ngoId,
        type,
        title,
        description,
        keyPoints: keyPoints ? JSON.parse(keyPoints) : [],
        applicationMode: applicationMode || "internal",
        externalLink,
        image,                    // Added image support
        isActive: true
      },
      { 
        new: true, 
        upsert: true 
      }
    );

    res.json({
      success: true,
      message: "Get Involved section saved successfully",
      data
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};