import { Request, Response } from "express";
// import { PrismaClient } from "generated/prisma";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createPost = async (req: Request,res: Response) => {
    const {content} = req.body;
    const userId = req.user?.id; 
    if(!userId || !content){
        res.status(400).json({ message: "Missing content or user" });
        return;
    }
    try {
        const post=await prisma.post.create({
            data:{
                content,
                userId,
            },
        });
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: "Error creating post" });
    }
};

export const getPosts = async (req: Request, res: Response) => {
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
                }
              },
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
        console.log("✅ Posts fetched:", posts);
        res.json(posts);
    } catch (err) {
        console.error("❌ Error fetching posts:", err);
        res.status(500).json({ message: "Error fetching posts" });
    }
};


export const deletePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;
  
    try {
      const post = await prisma.post.findUnique({ where: { id } });
  
      if (!post || post.userId !== userId) {
        res.status(403).json({ message: "Unauthorized or post not found" });
        return;
      }
  
      await prisma.post.delete({ where: { id } });
      res.json({ message: "Post deleted" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting post" });
    }
};