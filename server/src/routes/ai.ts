// server/src/routes/ai.ts (MODIFIED)
import { Router } from "express";
import { summarizeComments, suggestReply, analyzeResume } from "../controllers/aiController"; // Import the new function
import { resumeUpload } from '../utils/multerConfig'; // Import the new, memory-based upload middleware

const router = Router();

router.post("/summarize", (req, res, next) => {
  Promise.resolve(summarizeComments(req, res)).catch(next);
});
router.post("/suggest", (req, res, next) => {
  Promise.resolve(suggestReply(req, res)).catch(next);
});

// NEW Route for Resume/Portfolio Analysis
// 'file' is the field name Multer will look for in the form data
router.post(
  "/analyze-resume", 
  resumeUpload.single('file'), // Use the specific middleware for PDFs
  (req, res, next) => {
    Promise.resolve(analyzeResume(req, res)).catch(next);
  }
);

export default router;



// routes/ai.ts
// import { Router } from "express";
// import { summarizeComments, suggestReply } from "../controllers/aiController";

// const router = Router();

// router.post("/summarize", (req, res, next) => {
//   Promise.resolve(summarizeComments(req, res)).catch(next);
// });
// router.post("/suggest", (req, res, next) => {
//   Promise.resolve(suggestReply(req, res)).catch(next);
// });

// export default router;
