import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
export const handleFileUpload = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!req.file || !userId) {
      res.status(400).json({ message: "No file uploaded or user not authenticated." });
      return;
    }

    const newFilePath = `/uploads/${req.file.filename}`;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { profilePic: true }
    });

    if (user?.profilePic) {
      const oldPath = path.join(__dirname, "../../", user.profilePic);
      if (fs.existsSync(oldPath)) {
        try {
            fs.unlinkSync(oldPath); // Delete the old file
            console.log(`Successfully deleted old profile pic file: ${oldPath}`);
        } catch (unlinkError) {
            console.error(`Error deleting old profile pic file ${oldPath}:`, unlinkError);
        }
      } else {
          console.warn(`Old profile pic file not found on disk: ${oldPath}. Continuing to update DB.`);
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { profilePic: newFilePath }
    });

    res.status(200).json({
      message: "Profile photo updated successfully",
      profilePic: newFilePath // Send back the new path for the frontend
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};




