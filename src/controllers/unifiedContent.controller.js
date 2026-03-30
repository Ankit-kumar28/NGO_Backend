import { getLatestUpdates, getFeaturedContent } from "../services/unifiedContent.service.js";

export const getHomeContent = async (req, res) => {
  try {
    const ngoId = req.ngo._id; 

    const [latest, featured] = await Promise.all([
      getLatestUpdates(ngoId, 8),
      getFeaturedContent(ngoId, 4),
    ]);

    res.status(200).json({
      success: true,
      data: {
        latest,     
        featured,   
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch content" });
  }
};

export const getLatestOnly = async (req, res) => {
  try {
    const ngoId = req.ngo?._id;
    const limit = parseInt(req.query.limit) || 8;

    const latest = await getLatestUpdates(ngoId, limit);

    res.status(200).json({
      success: true,
      data: { latest }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};