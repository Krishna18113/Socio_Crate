// server/src/utils/multerConfig.ts (MODIFIED)
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the uploads folder exists (for persistent files like posts)
const uploadPath = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// --- CONFIGURATION FOR PERSISTENT POST/PROFILE FILES (diskStorage) ---
const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, filename);
  }
});

const postFileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".mp4", ".mov", ".webm"]; 
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedMimeTypes = ["image/png", "image/jpeg", "video/mp4", "video/quicktime", "video/webm"];

  if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Only ${allowedExtensions.join(', ').toUpperCase()} files are allowed for posts.`));
  }
};

export const upload = multer({ 
    storage: diskStorage, // Use disk storage for permanent files
    fileFilter: postFileFilter,
    limits: { fileSize: 20 * 1024 * 1024 } 
});

// --- NEW CONFIGURATION FOR TRANSIENT RESUME ANALYSIS (memoryStorage) ---

const resumeFileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Only allow PDF files for resumes
    if (file.mimetype === 'application/pdf' && path.extname(file.originalname).toLowerCase() === '.pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed for resume analysis.'));
    }
};

export const resumeUpload = multer({
    storage: multer.memoryStorage(), // Store file buffer in memory, don't save to disk
    fileFilter: resumeFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Max 5MB for a PDF
});



// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Ensure the uploads folder exists
// const uploadPath = path.join(__dirname, "../../uploads");
// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (_req, _file, cb) => {
//     cb(null, uploadPath);
//   },
//   filename: (_req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const filename = `${Date.now()}-${file.fieldname}${ext}`;
//     cb(null, filename);
//   }
// });

// const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//   // 🔑 UPDATED: Allow common image and video formats for social media posts
//   const allowedExtensions = [".png", ".jpg", ".jpeg", ".mp4", ".mov", ".webm"]; 
//   const ext = path.extname(file.originalname).toLowerCase();
//   
//   // Also check the MIME type for better security/validation
//   const allowedMimeTypes = ["image/png", "image/jpeg", "video/mp4", "video/quicktime", "video/webm"];

//   if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error(`Only ${allowedExtensions.join(', ').toUpperCase()} files are allowed for posts.`));
//   }
// };

// export const upload = multer({ 
//     storage, 
//     fileFilter,
//     limits: { fileSize: 20 * 1024 * 1024 } // Optional: Limit file size to 10MB
// });


