// server/src/controllers/userController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const getAbsolutePath = (relativePath: string) => {
    return path.join(__dirname, "../../uploads", relativePath.replace("/uploads/", ""));
};
export const deleteProfilePic = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: "User not authenticated." });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { profilePic: true } // We only need the profilePic path
        });

        if (!user || !user.profilePic) {
            res.status(404).json({ message: "No profile picture found to delete." });
            return;
        }

        const oldProfilePicPath = user.profilePic; // This is like "/uploads/some-image.png"
        const absolutePathToFile = getAbsolutePath(oldProfilePicPath); // This is the full path on your server

        if (fs.existsSync(absolutePathToFile)) { // Check if the file really exists first
            try {
                fs.unlinkSync(absolutePathToFile); // Permanently delete the file
                console.log(`Deleted profile pic file from server: ${absolutePathToFile}`);
            } catch (unlinkError) {
                console.error(`Error deleting file ${absolutePathToFile}:`, unlinkError);
            }
        } else {
            console.warn(`File not found on disk for deletion: ${absolutePathToFile}. Removing DB entry.`);
        }

        await prisma.user.update({
            where: { id: userId },
            data: { profilePic: null } // Set profilePic to null
        });

        res.status(200).json({ message: "Profile picture deleted successfully." });

    } catch (error) {
        console.error("Failed to delete profile picture:", error);
        res.status(500).json({ message: "Server error" });
    }
};