import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs"; // Needed for file system operations
import path from "path"; // Needed for path manipulation

const prisma = new PrismaClient();

// Helper to determine the file type for the database
const getMediaType = (mimetype: string): string => {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    return 'other'; 
};

export const createPost = async (req: Request, res: Response): Promise<void> => {
    // Content is in req.body
    const { content } = req.body; 
    // 🔑 CRITICAL CHANGE 1: Use req.files (array) instead of req.file (single object)
    const files = req.files as Express.Multer.File[] | undefined; 
    const userId = req.user?.id; 

    // A post must contain text, a file, or both.
    if (!userId || (!content && (!files || files.length === 0))) {
        // 🔑 Updated error message to reflect multi-file capability
        res.status(400).json({ message: "Post must contain text content or at least one media file." });
        return;
    }

    // 1. Prepare data structure for multiple file creation (createMany)
    const fileData = files ? files.map(file => ({
        url: `${process.env.BASE_URL || "https://sociocrate.onrender.com"}/uploads/${file.filename}`,
        //url: `/uploads/${file.filename}`, // Local storage path
        type: getMediaType(file.mimetype), // Determine type (image/video/other)
        userId: userId!, // Link file to the user who uploaded it
    })) : [];

    try {
        const post = await prisma.post.create({
            data: {
                content: content || "", 
                userId,
                // 🔑 CRITICAL CHANGE 2: Use createMany to insert all file records linked to the new Post
                files: fileData.length > 0 ? {
                    createMany: {
                        data: fileData,
                    },
                } : undefined, // Skip creating file records if no files were uploaded
            },
            // Include the created files and user info in the response
            include: {
                files: true, 
                user: { select: { id: true, name: true, profilePic: true } }
            }
        });

        res.status(201).json(post);
    } catch (err) {
        // 🔑 CRITICAL CHANGE 3: Clean up ALL uploaded files if DB transaction fails
        if (files && files.length > 0) {
            files.forEach(file => {
                 // Adjust path based on your server structure. Assumes 'uploads' is parallel to 'src'.
                const filePath = path.join(__dirname, "../../uploads", file.filename);
                try {
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        console.warn(`Cleaned up file after failed DB transaction: ${filePath}`);
                    }
                } catch (cleanupErr) {
                    console.error("Failed to clean up uploaded file:", cleanupErr);
                }
            });
        }
        console.error("Error creating post:", err);
        res.status(500).json({ message: "Error creating post with media" });
    }
};

export const getPosts = async (req: Request, res: Response) => {
    // No changes needed here, as 'files: true' is already included.
    try {
        console.log("📥 Fetching posts...");
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profilePic: true,
                    }
                },
                // Include files associated with the post when fetching
                files: true, 
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
            },
        });
        console.log("✅ Posts fetched.");
        res.json(posts);
    } catch (err) {
        console.error("❌ Error fetching posts:", err);
        res.status(500).json({ message: "Error fetching posts" });
    }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
    // No changes needed here, as the loop correctly handles all files in post.files.
    const { id } = req.params;
    const userId = req.user?.id;
    
    try {
      const post = await prisma.post.findUnique({ 
        where: { id },
        include: { files: true } // Include files to handle cleanup
      });
      
      if (!post || post.userId !== userId) {
        res.status(403).json({ message: "Unauthorized or post not found" });
        return;
      }

      // Delete associated files from the local storage
      if (post.files && post.files.length > 0) {
          post.files.forEach(file => {
              // Assuming 'file.url' is '/uploads/filename.ext'
              const filePath = path.join(__dirname, "../../", file.url);
              try {
                  if (fs.existsSync(filePath)) {
                      fs.unlinkSync(filePath);
                      console.log(`Deleted media file from server: ${filePath}`);
                  }
              } catch (cleanupErr) {
                  console.error(`Error deleting post media file ${filePath}:`, cleanupErr);
              }
          });
      }

      // Prisma's onDelete: Cascade handles deleting the File records from the DB
      await prisma.post.delete({ where: { id } });
      res.json({ message: "Post and associated media deleted" });
    } catch (err) {
      console.error("Error deleting post:", err);
      res.status(500).json({ message: "Error deleting post" });
    }
};

// 🔑 NEW CONTROLLER FUNCTION
export const getUserPosts = async (req: Request, res: Response) => {
    // The 'protect' middleware ensures req.user is populated
    const userId = req.user?.id; 

    if (!userId) {
        // This should theoretically be unreachable if 'protect' works, but it's safe.
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    try {
        const posts = await prisma.post.findMany({
            where: {
                // Filter posts by the logged-in user's ID
                userId: userId, 
            },
            include: {
                user: {
                    select: {
                        id: true, // 🔑 Select ID for client-side keys/links
                        name: true,
                        profilePic: true, // Include profile pic for the author
                    },
                },
                files: true,
                comments: {
                    include: {
                        user: {
                            select: { id: true, name: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Send the array of user-specific posts
        res.json(posts);
    } catch (err) {
        console.error('Error fetching user posts:', err);
        res.status(500).json({ message: 'Error fetching user posts.' });
    }
};

