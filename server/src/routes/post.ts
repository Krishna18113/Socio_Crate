// server/src/routes/post.ts (UPDATED)
import { Router } from "express";
// 🔑 Import the new controller function
import { createPost, getPosts, deletePost, getUserPosts } from "../controllers/postController";

// Helper to wrap async route handlers and forward errors to Express
const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);
import { protect } from "../middleware/authMiddleware";
import { PrismaClient } from "@prisma/client";
import { upload } from "../utils/multerConfig"; 

const prisma = new PrismaClient();
const router = Router();

// Existing routes
router.post("/", protect, upload.array('mediaFiles', 5), createPost); 
router.get("/", getPosts); // GET /api/posts (ALL posts for Feed)
router.get("/me", protect, asyncHandler(getUserPosts)); // GET /api/posts/me (CURRENT USER's posts for Dashboard)
router.delete("/:id", protect, deletePost);

export default router;

// ❌ OLD LOGIC REMOVED: The logic below is now moved to postController.ts
/* router.get("/user", protect, async (req, res) => {
    // ... logic moved to controller ...
});
*/



// import { Router } from "express";
// import { createPost, getPosts, deletePost } from "../controllers/postController";
// import { protect } from "../middleware/authMiddleware";
// import { PrismaClient } from "@prisma/client";
// import { upload } from "../utils/multerConfig"; // 🔑 Import the Multer configuration

// const prisma = new PrismaClient();
// const router = Router();

// // 🔑 CRITICAL CHANGE: Apply Multer middleware (upload.single('mediaFile'))
// // This middleware processes the file upload before handing control to createPost.
// // 'mediaFile' is the expected key in the client's FormData.
// router.post("/", protect, upload.array('mediaFiles', 5), createPost); 

// router.get("/", getPosts);
// router.delete("/:id", protect, deletePost);

// // Route to get current user's posts
// router.get("/user", protect, async (req, res) => {
//     try {
//       const posts = await prisma.post.findMany({
//         // Filtering to show ONLY the current user's posts
//         where: { userId: req.user!.id }, 
//         include: {
//           user: {
//             select: {
//               name: true,
//             },
//           },
//           // 🔑 Include the files associated with the post
//           files: true, 
//           comments: {
//             include: {
//               user: {
//                 select: { id: true, name: true },
//               },
//             },
//           },
//         },
//         orderBy: { createdAt: "desc" },
//       });
//       res.json(posts);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Something went wrong" });
//     }
//   });

// export default router;





// import { Router } from "express";
// import { createPost, getPosts, deletePost } from "../controllers/postController";
// import { protect } from "../middleware/authMiddleware";
// // import { PrismaClient } from "generated/prisma";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
// const router = Router();

// router.post("/", protect, createPost);
// router.get("/", getPosts);
// router.delete("/:id", protect, deletePost);

// // ✅ New route to get current user's posts
// router.get("/user", protect, async (req, res) => {
//     try {
//       const posts = await prisma.post.findMany({
//         // where: { userId: req.user!.id },
//         include: {
//           user: {
//             select: {
//               name: true,
//             },
//           },
//           comments: {
//             include: {
//               user: {
//                 select: { id: true, name: true },
//               },
//             },
//           },
//         },
//         orderBy: { createdAt: "desc" },
//       });
//       res.json(posts);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Something went wrong" });
//     }
//   });

// export default router;
