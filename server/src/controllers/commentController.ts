import { Request, Response } from "express";
// import { PrismaClient } from "generated/prisma";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const addComment = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { content, parentCommentId } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId: req.user!.id,
        parentCommentId: parentCommentId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    if (comment.userId !== req.user!.id) {
      res.status(401).json({ message: "Not authorized to delete this comment" });
      return;
    }

    await prisma.comment.delete({ where: { id } });

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
};

export const getComments = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
};
