import  GetInvolved  from "../models/getInvolved.model.js";

export const getGetInvolved = async (req, res) => {
  try {
    const data = await GetInvolved.find({
      ngo: req.ngo,
      isActive: true
    }).sort({ order: 1 });
console.log("check ",req.ngo)
    res.json({
      success: true,
      data
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const upsertGetInvolved = async (req, res) => {
  try {

    console.log("creating getinvolde...")
    const {
      type,
      title,
      description,
      keyPoints,
      applicationMode,
      externalLink
    } = req.body;
    console.log(req.body)

    let image = "";

    if (req.file) {
      image = `/uploads/${req.ngoName}/${req.file.filename}`;
    }

    const data = await GetInvolved.create(
      {
        ngo: req.ngoId,
        type,
      
        title,
        description,
        keyPoints: keyPoints ? JSON.parse(keyPoints) : [],
        applicationMode,
        externalLink,
        
      },
    //   {
    //     new: true,
    //     upsert: true
    //   }
    );

    res.json({
      success: true,
      message: "Saved successfully",
      data
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};