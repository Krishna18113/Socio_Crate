// routes/ai.ts
import { Router } from "express";
import { summarizeComments, suggestReply } from "../controllers/aiController";

const router = Router();

router.post("/summarize", (req, res, next) => {
  Promise.resolve(summarizeComments(req, res)).catch(next);
});
router.post("/suggest", (req, res, next) => {
  Promise.resolve(suggestReply(req, res)).catch(next);
});

export default router;
