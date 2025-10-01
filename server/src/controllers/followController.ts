import { Request, Response } from "express";
// import { PrismaClient } from "generated/prisma";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// @ POST /users/:id/follow
export const followUser = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const targetId = req.params.id;

  if (userId === targetId) {
    res.status(400).json({ error: "You cannot follow yourself" });
    return;
  }

  try {
    await prisma.follow.create({
      data: {
        followerId: userId,
        followingId: targetId,
      },
    });
    res.status(200).json({ message: "User followed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Already following or internal error" });
  }
};

// @ POST /users/:id/unfollow
export const unfollowUser = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const targetId = req.params.id;

  try {
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetId,
        },
      },
    });
    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Not following or internal error" });
  }
};

// @ GET /users/:id/followers
export const getFollowers = async (req: Request, res: Response) => {
  const targetId = req.params.id;

  try {
    type FollowerWithUser = {
        follower: {
          id: string;
          name: string;
          email: string;
        };
      };
      const followers = await prisma.follow.findMany({
        where: { followingId: targetId },
        include: {
          follower: true, // includes full follower user object
        },
      }) as FollowerWithUser[];
            
    res.status(200).json(followers.map(f => f.follower));
  } catch (error) {
    res.status(500).json({ error: "Failed to get followers" });
  }
};

// @ GET /users/:id/following
export const getFollowing = async (req: Request, res: Response) => {
  const targetId = req.params.id;

  try {
    type FollowerWithUser = {
        following: {
          id: string;
          name: string;
          email: string;
        };
      };
    const following = await prisma.follow.findMany({
      where: { followerId: targetId },
      include: { following: true },
    }) as FollowerWithUser[];;
    res.status(200).json(following.map(f => f.following));
  } catch (error) {
    res.status(500).json({ error: "Failed to get following" });
  }
};
