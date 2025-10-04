// server/src/utils/geminiClient.ts (MODIFIED)
import { GoogleGenerativeAI, Part, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Existing function for text-only prompts
export const getGeminiSuggestion = async (prompt: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

// NEW function for multi-part (text + file) prompts
export const getGeminiAnalysis = async (contents: (string | Part)[]) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-pro", // Use a more powerful model for analysis
        generationConfig: {
            // Enforce JSON output for structured data
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                    resumeQualityScore: { type: SchemaType.NUMBER, description: "Score from 1 to 100 on structure, clarity, and grammar." },
                    jobReadinessScore: { type: SchemaType.NUMBER, description: "Score from 1 to 100 on relevance to the desired role." },
                    analysisSummary: { type: SchemaType.STRING },
                    keywordsPresent: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                    keywordsMissing: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                    suggestions: {
                        type: SchemaType.OBJECT,
                        properties: {
                            structure: { type: SchemaType.STRING },
                            skills: { type: SchemaType.STRING },
                            achievements: { type: SchemaType.STRING }
                        }
                    }
                }
            }
        }
    });

    // The contents array will now contain both the file part and the prompt text.
    // We must map strings to {text: string} to satisfy the Part[] type.
    const parts: Part[] = contents.map(part => (typeof part === 'string' ? { text: part } : part));

    const result = await model.generateContent({
        contents: [{ role: "user", parts: parts }],
    });

    // The response text is a JSON string due to the config
    const response = await result.response;
    return response.text();
};

// Also export the genAI instance if needed elsewhere
export const geminiClient = genAI;
