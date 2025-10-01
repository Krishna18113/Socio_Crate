import { Router } from "express";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  // checkFollowing,
} from "../controllers/followController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/:id/follow", protect, followUser);
router.post("/:id/unfollow", protect, unfollowUser);
router.get("/:id/followers", getFollowers);
router.get("/:id/following", getFollowing);
// router.get('/:id/status', protect, checkFollowing);

export default router;
