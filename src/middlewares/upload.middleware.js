import multer from "multer";
import fs from "fs";
import ngoModel from "../models/ngo.model.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    ngoModel.findById(req.ngoId)
      .select("name")
      .then((ngo) => {

        if (!ngo) {
          return cb(new Error("NGO not found"), null);
        }

        console.log("NGO:", ngo.name);

        
        const ngoFolderName = ngo.name.replace(/\s+/g, "_");

        const uploadPath = `public/uploads/${ngoFolderName}`;

        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);

      })
      .catch((error) => {
        console.error(error);
        cb(error, null);
      });
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});


const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
    "image/avif",
    
    "video/mp4",
    "video/webm",
    "video/quicktime",   
    
    "application/pdf"
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.log(`Rejected file type: ${file.mimetype} - ${file.originalname}`);
    cb(new Error(`Only images, videos, and PDFs are allowed. Received: ${file.mimetype}`), false);
  }
};


export const upload = multer({
  storage,
  fileFilter,
  
});