import express from "express";
import { addComment, deleteComment, getComments } from "../controllers/commentController"
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/posts/:postId/comments", protect, getComments);
router.post("/posts/:postId/comments", protect, addComment);
router.delete("/comments/:id", protect, deleteComment);

export default router;
