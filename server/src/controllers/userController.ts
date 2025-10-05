import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs"; // Required for file system operations (like deleting profile pics)
import path from "path"; // Required for path manipulation

const prisma = new PrismaClient();

// Helper function to convert the relative DB path to an absolute server path
const getAbsolutePath = (relativePath: string) => {
    // This assumes the file path stored in the DB (e.g., /uploads/image.png) is relative to the project root's 'uploads' folder.
    return path.join(__dirname, "../../uploads", relativePath.replace("/uploads/", ""));
};

// Get a user's profile details
export const getUserProfile = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                profilePic: true,
                // Include the new description field
                description: true, 
                // Count followers/following (read-only data for profile view)
                _count: {
                    select: {
                        followers: true,
                        following: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error("Error fetching user profile:", err);
        res.status(500).json({ message: "Error fetching user profile" });
    }
};

// Allow user to update their profile information (name, description, etc.)
export const updateProfile = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    // Get fields from request body. Description is optional (can be null/undefined).
    const { name, profilePic, description } = req.body; 

    if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                // Conditionally update fields if they are provided
                ...(name !== undefined && { name }), 
                ...(profilePic !== undefined && { profilePic }), 
                // Allow 'description' to be explicitly set to null/empty string, or updated
                ...(description !== undefined && { description }), 
            },
            select: { 
                id: true, 
                name: true, 
                email: true, 
                profilePic: true, 
                description: true // Return the updated description
            } 
        });

        res.json(updatedUser);
    } catch (err) {
        console.error("Error updating user profile:", err);
        res.status(500).json({ message: "Failed to update profile" });
    }
};

// Delete a user's profile picture from the database and disk
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
            data: { profilePic: null } // Set profilePic to null in the database
        });

        res.status(200).json({ message: "Profile picture deleted successfully." });

    } catch (error) {
        console.error("Failed to delete profile picture:", error);
        res.status(500).json({ message: "Server error" });
    }
};


