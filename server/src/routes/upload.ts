// server/src/routes/upload.ts
import express from "express";
import { upload } from "../utils/multerConfig";
import { protect } from "../middleware/authMiddleware";
import { handleFileUpload } from "../controllers/uploadController"; // ✅ import controller

const router = express.Router();

// Use controller here (This is for uploading/replacing a profile picture)
router.post("/", protect, upload.single("file"), handleFileUpload);

export default router;
  

// import express from "express";
// import { upload } from "../utils/multerConfig";
// import { protect } from "../middleware/authMiddleware";
// import { PrismaClient } from "@prisma/client";
// import path from "path";
// import fs from "fs";

// const router = express.Router();
// const prisma = new PrismaClient();

// // Upload single file: profilePic only (.png)
// router.post(
//   "/",
//   protect,
//   upload.single("file"),
//   async (req, res): Promise<void> => {
//     try {
//       const userId = req.user?.id;
//       if (!userId) {
//         res.status(401).json({ message: "Unauthorized" });
//         return;
//       }

//       if (!req.file) {
//         res.status(400).json({ message: "No file uploaded" });
//         return;
//       }

//       const filePath = `/uploads/${req.file.filename}`;
//       const ext = path.extname(req.file.originalname).toLowerCase();

//       if (ext !== ".png") {
//         res.status(400).json({ message: "Only .png files are allowed for profilePic" });
//         return;
//       }

//       const user = await prisma.user.findUnique({ where: { id: userId } });

//       if (!user) {
//         res.status(404).json({ message: "User not found" });
//         return;
//       }

//       // Delete old profilePic if it exists
//       if (user.profilePic) {
//         const fullPath = path.join(__dirname, "../../", user.profilePic);
//         if (fs.existsSync(fullPath)) {
//           fs.unlinkSync(fullPath);
//         }
//       }

//       // Update profilePic in DB
//       const updatedUser = await prisma.user.update({
//         where: { id: userId },
//         data: { profilePic: filePath },
//       });

//       res.status(200).json({ message: "Profile picture uploaded successfully", user: updatedUser });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// export default router;



// import express from "express";
// import { upload } from "../utils/multerConfig";
// import { protect } from "../middleware/authMiddleware";
// import { PrismaClient } from "@prisma/client";
// import path from "path";
// import fs from "fs";

// const router = express.Router();
// const prisma = new PrismaClient();

// // Upload single file: profilePic or resume
// router.post(
//   "/",
//   protect,
//   upload.single("file"),
//   async (req, res): Promise<void> => {
//     try {
//       const userId = req.user?.id;
//       if (!userId) {
//         res.status(401).json({ message: "Unauthorized" });
//         return;
//       }

//       if (!req.file) {
//         res.status(400).json({ message: "No file uploaded" });
//         return;
//       }

//       const filePath = `/uploads/${req.file.filename}`;
//       const ext = path.extname(req.file.originalname).toLowerCase();

//       const user = await prisma.user.findUnique({ where: { id: userId } });

//       if (!user) {
//         res.status(404).json({ message: "User not found" });
//         return;
//       }

//       // Delete old file if exists
//       const previousPath = ext === ".png" ? user.profilePic : user.resume;
//       if (previousPath) {
//         const fullPath = path.join(__dirname, "../../", previousPath);
//         if (fs.existsSync(fullPath)) {
//           fs.unlinkSync(fullPath);
//         }
//       }

//       // Update in DB
//       const updatedUser = await prisma.user.update({
//         where: { id: userId },
//         data: ext === ".png" ? { profilePic: filePath } : { resume: filePath },
//       });

//       res.status(200).json({ message: "Upload successful", user: updatedUser });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// export default router;
