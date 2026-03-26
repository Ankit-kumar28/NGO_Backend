// import multer from "multer";
// import fs from "fs";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     try {
      
      

// console.log("ngo:--",req.ngoName);
// // const ngoFolderName = req.ngoCode || "default";
// const ngoFolderName = req.ngoName || "default";


//       const uploadPath = `public/uploads/${ngoFolderName}`;

//       // create folder if not exists
//       if (!fs.existsSync(uploadPath)) {
//         fs.mkdirSync(uploadPath, { recursive: true });
//       }

//       cb(null, uploadPath);

//     } catch (error) {
//       cb(error, null);
//     }
//   },

//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   }
// });

// export const upload = multer({ storage });


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

        console.log("👉 NGO:", ngo.name);

        // 🔥 safe folder name
        const ngoFolderName = ngo.name.replace(/\s+/g, "_");

        const uploadPath = `public/uploads/${ngoFolderName}`;

        // create folder if not exists
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


// 🔥 FILE FILTER (Image + PDF)
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images and PDFs allowed"), false);
  }
};


// 🔥 SIZE LIMIT (important)
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});