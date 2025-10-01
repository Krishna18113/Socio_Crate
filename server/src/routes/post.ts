import { Router } from "express";
import { createPost, getPosts, deletePost } from "../controllers/postController";
import { protect } from "../middleware/authMiddleware";
// import { PrismaClient } from "generated/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.post("/", protect, createPost);
router.get("/", getPosts);
router.delete("/:id", protect, deletePost);

// ✅ New route to get current user's posts
router.get("/user", protect, async (req, res) => {
    try {
      const posts = await prisma.post.findMany({
        // where: { userId: req.user!.id },
        include: {
          user: {
            select: {
              name: true,
            },
          },
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
      res.json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong" });
    }
  });

export default router;
