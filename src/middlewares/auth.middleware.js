import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded;     
    req.ngoId = decoded.ngoId;   
    req.ngoCode=decoded.ngoCode
    req.ngoName = decoded.ngoName;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.name);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired"
      });
    }

    res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};