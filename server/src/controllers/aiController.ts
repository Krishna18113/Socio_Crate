import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { getGeminiAnalysis, geminiClient } from '../utils/geminiClient';

const prisma = new PrismaClient();
// Ensure environment variables are loaded in your server's entry file (e.g., index.ts)
// for this to work correctly!
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function fileToGenerativePart(buffer: Buffer, mimeType: string): Part {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType
    },
  };
}

// 🧠 AI PROMPTS
const SYSTEM_SUMMARY_PROMPT = `You are a professional assistant summarizing discussions on a social platform. Your goal is to write a clear, concise, and neutral summary of the conversation around a specific post in 3-5 sentences.`;
const SYSTEM_REPLY_PROMPT = `You are an expert social media assistant helping users craft thoughtful, professional replies to discussions. Your suggestions should be clear, relevant, and respectful. Provide only the suggested reply text, without any introductory phrases or greetings.`;

// 🔧 Helper to get Gemini text
const getGeminiResponse = async (systemPrompt: string, userPrompt: string) => {
  // Use 'gemini-2.5-flash' for the latest available model for speed and capability
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ],
    systemInstruction: systemPrompt
  });

  return result.response.text().trim();
};

// 📝 Helper to fetch all necessary context (Post and Comments)
const fetchPostContext = async (postId: string) => {
    // 1. Fetch the post itself to get the original context
    const post = await prisma.post.findUnique({
        where: { id: postId },
    });

    if (!post) {
        throw new Error("Post not found.");
    }

    // 2. Fetch comments related to the post
    const comments = await prisma.comment.findMany({
        where: { postId },
        orderBy: { createdAt: "asc" },
        include: { user: { select: { name: true } } },
    });

    // Format the original post content (handling media-only posts)
    const postContent = post.content || `[Original Post: Media only]`;

    // Format all comments
    const formattedComments = comments
        // Handling comments that might be media-only (content is null)
        .map((c) => `- ${c.user.name}: ${c.content || '[Media Comment]'}`)
        .join("\n");

    return { postContent, formattedComments };
};


// 📝 Summarize Comments Handler
export const summarizeComments = async (req: Request, res: Response) => {
  const { postId } = req.body; 

  try {
    const { postContent, formattedComments } = await fetchPostContext(postId);

    if (!formattedComments.trim()) {
      // Return 200 with a message if no comments exist (better than 404)
      return res.status(200).json({ summary: "No comments yet. There is nothing to summarize." });
    }

    const userPrompt = 
        `Original Post:
        ---
        ${postContent}
        ---

        Discussion/Comments:
        ---
        ${formattedComments}
        ---

        Please provide the summary requested in the system instructions.`;

    const summary = await getGeminiResponse(SYSTEM_SUMMARY_PROMPT, userPrompt);
    res.json({ summary });
  } catch (error: any) {
    console.error("Summarize Error:", error?.message || error);
    if (error.message === "Post not found.") {
        return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to summarize comments", error: error?.message });
  }
};


// 💬 Suggest Reply Handler
export const suggestReply = async (req: Request, res: Response) => {
  const { postId } = req.body;
  
  try {
    const { postContent, formattedComments } = await fetchPostContext(postId);

    if (!formattedComments.trim()) {
      // Suggestion for an empty comment section
      return res.status(200).json({ suggestion: "Be the first to comment! Start by introducing a key question or insight." });
    }
    
    // Include the original post and comments for full context
    const userPrompt = 
        `Based on the following original post and subsequent comments, generate a thoughtful reply.

        Original Post:
        ---
        ${postContent}
        ---

        Discussion/Comments:
        ---
        ${formattedComments}
        ---

        Please provide the suggested reply text as directed by the system instructions.`;

    const suggestion = await getGeminiResponse(SYSTEM_REPLY_PROMPT, userPrompt);
    res.json({ suggestion });
  } catch (error: any) {
    console.error("Suggest Error:", error?.message || error);
    if (error.message === "Post not found.") {
        return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to suggest a reply", error: error?.message });
  }
};

export const analyzeResume = async (req: Request, res: Response) => {
  const { rolePreference, portfolioLink } = req.body; // rolePreference is required
  const file = req.file; // From multer.memoryStorage()
  
  if (!rolePreference) {
    return res.status(400).json({ message: "Job role preference is required for analysis." });
  }

  const contents: (string | Part)[] = [];
  let inputType = '';

  try {
    if (file) {
      // 1. Handle PDF File Upload
      const pdfPart = fileToGenerativePart(file.buffer, file.mimetype);
      inputType = 'resume PDF';
      contents.push(pdfPart);
    } else if (portfolioLink) {
      // 2. Handle Portfolio Link (treating it as text input)
      inputType = 'portfolio link';
      contents.push(`Please review and analyze the content accessible via this link: ${portfolioLink}.`);
    } else {
      return res.status(400).json({ message: "A resume file (PDF) or a portfolio link is required." });
    }

    // Main Prompt
    const prompt = `You are a career coach AI. Analyze the provided ${inputType} for a user aiming for a **${rolePreference}** position. Provide a detailed, professional, and actionable report. The output MUST be a single, valid JSON object, strictly adhering to the schema provided in the function call. Do not include any other text or markdown outside the JSON block. Focus on resume quality (keywords, structure, grammar) and job readiness.`;

    contents.push(prompt);

    // Call the new Gemini analysis function
    const jsonResponseText = await getGeminiAnalysis(contents);
    
    // 🔑 THE CRITICAL FIX: Robust JSON extraction
    // Regex to find and extract the JSON block (handling markdown code fences)
    const jsonMatch = jsonResponseText.match(/```json\s*([\s\S]*?)\s*```/i) || jsonResponseText.match(/\{[\s\S]*\}/);
    
    let jsonString: string;
    
    if (jsonMatch) {
      jsonString = jsonMatch[1] || jsonMatch[0]; // Take group 1 (inside fences) or whole match
    } else {
        // Fallback if no markdown fences are found, assume the entire output is the JSON string
        jsonString = jsonResponseText;
    }

    // Parse the structured JSON response
    const analysisReport = JSON.parse(jsonString);

    res.status(200).json(analysisReport);

  } catch (error: any) {
    console.error("Resume analysis failed:", error.message || error);
    // Provide a more specific error message if it's a JSON parse issue
    if (error instanceof SyntaxError) {
        return res.status(500).json({ 
            message: "Failed to parse AI response. The model returned malformed data.", 
            details: error.message 
        });
    }
    res.status(500).json({ message: "Failed to analyze the input. Please ensure the PDF is readable or the link is public." });
  }
};


// import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const prisma = new PrismaClient();
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// // 🧠 AI PROMPTS
// const SYSTEM_SUMMARY_PROMPT = `You are a professional assistant summarizing discussions on a social platform. Your goal is to write a clear, concise, and neutral summary of the conversation around a specific post.`;
// const SYSTEM_REPLY_PROMPT = `You are an expert social media assistant helping users craft thoughtful, professional replies to discussions. Your suggestions should be clear, relevant, and respectful.`;

// // 🔧 Helper to get Gemini text
// const getGeminiResponse = async (systemPrompt: string, userPrompt: string) => {
//   const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//   const result = await model.generateContent({
//     contents: [
//       {
//         role: "system",
//         parts: [{ text: systemPrompt }],
//       },
//       {
//         role: "user",
//         parts: [{ text: userPrompt }],
//       },
//     ],
//   });

//   return result.response.text();
// };


// // 📝 Summarize Comments Handler
// export const summarizeComments = async (req: Request, res: Response) => {
//   const { postId } = req.body;

//   try {
//     const comments = await prisma.comment.findMany({
//       where: { postId },
//       orderBy: { createdAt: "asc" },
//       include: { user: true },
//     });

//     if (comments.length === 0) {
//       res.status(404).json({ message: "No comments found for this post." });
//       return;
//     }

//     const formattedComments = comments
//       .map((c) => `- ${c.user.name}: ${c.content}`)
//       .join("\n");

//     const userPrompt = `Summarize the following discussion in 3-5 sentences, focusing on key points, agreements, and any differing opinions:\n\n[Comments start]\n${formattedComments}\n[Comments end]`;

//     const summary = await getGeminiResponse(SYSTEM_SUMMARY_PROMPT, userPrompt);
//     res.json({ summary });
//   } catch (error: any) {
//     console.error("Summarize Error:", error?.message || error);
//     res.status(500).json({ message: "Failed to summarize comments", error: error?.message });
//   }
// };

// // 💬 Suggest Reply Handler
// export const suggestReply = async (req: Request, res: Response) => {
//   const { postId } = req.body;
//   console.log("It's here");

//   try {
//     const comments = await prisma.comment.findMany({
//       where: { postId },
//       orderBy: { createdAt: "asc" },
//       include: { user: true },
//     });

//     if (comments.length === 0) {
//       res.status(404).json({ message: "No comments found for this post." });
//       return;
//     }

//     const formattedComments = comments
//       .map((c) => `- ${c.user.name}: ${c.content}`)
//       .join("\n");

//     const userPrompt = `Based on the following discussion, suggest a professional reply that contributes positively to the conversation:\n\n[Comments start]\n${formattedComments}\n[Comments end]`;

//     const suggestion = await getGeminiResponse(SYSTEM_REPLY_PROMPT, userPrompt);
//     res.json({ suggestion });
//   } catch (error: any) {
//     console.error("Suggest Error:", error?.message || error);
//     res.status(500).json({ message: "Failed to suggest a reply", error: error?.message });
//   }
// };











// import { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";
// import OpenAI from "openai";

// const prisma = new PrismaClient();
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // 🧠 AI PROMPTS
// const SYSTEM_SUMMARY_PROMPT = `You are a professional assistant summarizing discussions on a social platform. Your goal is to write a clear, concise, and neutral summary of the conversation around a specific post.`;
// const SYSTEM_REPLY_PROMPT = `You are an expert social media assistant helping users craft thoughtful, professional replies to discussions. Your suggestions should be clear, relevant, and respectful.`;

// // 📝 Summarize Comments Handler
// export const summarizeComments = async (req: Request, res: Response) => {
//   const { postId } = req.body;
//   try {
//     const comments = await prisma.comment.findMany({
//       where: { postId },
//       orderBy: { createdAt: "asc" },
//       include: {
//         user: true,
//       },
//     });

//     if (comments.length === 0) {
//       res.status(404).json({ message: "No comments found for this post." });
//       return;
//     }

//     const formattedComments = comments.map(
//       (c) => `- ${c.user.name}: ${c.content}`
//     ).join("\n");

//     const userPrompt = `Summarize the following discussion in 3-5 sentences, focusing on key points, agreements, and any differing opinions:\n\n[Comments start]\n${formattedComments}\n[Comments end]`;

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         { role: "system", content: SYSTEM_SUMMARY_PROMPT },
//         { role: "user", content: userPrompt },
//       ],
//       temperature: 0.7,
//       max_tokens: 500,
//     });

//     const summary = response.choices[0]?.message?.content;
//     res.json({ summary });
//   } catch (error) {
//     console.error("Summarize Error:", error);
//     res.status(500).json({ message: "Failed to summarize comments" });
//   }
// };

// // 💬 Suggest Reply Handler
// export const suggestReply = async (req: Request, res: Response) => {
//   const { postId } = req.body;
//   console.log("It's here");
//   try {
//     const comments = await prisma.comment.findMany({
//       where: { postId },
//       orderBy: { createdAt: "asc" },
//       include: {
//         user: true,
//       },
//     });

//     if (comments.length === 0) {
//       res.status(404).json({ message: "No comments found for this post." });
//       return;
//     }

//     const formattedComments = comments.map(
//       (c) => `- ${c.user.name}: ${c.content}`
//     ).join("\n");

//     const userPrompt = `Based on the following discussion, suggest a professional reply that contributes positively to the conversation:\n\n[Comments start]\n${formattedComments}\n[Comments end]`;

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         { role: "system", content: SYSTEM_REPLY_PROMPT },
//         { role: "user", content: userPrompt },
//       ],
//       temperature: 0.7,
//       max_tokens: 500,
//     });

//     const suggestion = response.choices[0]?.message?.content;
//     res.json({ suggestion });
//   } //catch (error) {
//   //   console.error("Suggest Error:", error);
//   //   res.status(500).json({ message: "Failed to suggest a reply" });
//   // }
//   catch (error: any) {
//   console.error("Suggest Error:", error?.response?.data || error.message || error);
//   res.status(500).json({ message: "Failed to suggest a reply", error: error?.message });
// }

// };
