import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const apiKey = process.env.API_KEY;

// Schema definition for the strict JSON output we expect from Gemini
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    matchScore: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 indicating how well the resume matches the job description.",
    },
    missingKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of critical keywords or skills found in the job description but missing from the resume.",
    },
    critiquePoints: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING, description: "The original weak bullet point or section from the resume." },
          feedback: { type: Type.STRING, description: "Why this is weak or bad." },
          rewritten: { type: Type.STRING, description: "A much stronger, ATS-optimized version of the bullet point." },
        },
      },
      description: "Identify exactly 3 specific areas for improvement.",
    },
    roastComment: {
      type: Type.STRING,
      description: "A short, witty, and slightly mean 'roast' from the perspective of a tired hiring manager.",
    },
  },
  required: ["matchScore", "missingKeywords", "critiquePoints", "roastComment"],
};

export const analyzeResume = async (resumeText: string, jobDescription: string): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are a strict, no-nonsense, elite Hiring Manager at a top tech company. You have seen thousands of bad resumes.
    
    Task: Review the provided Candidate Resume against the Job Description.
    
    Job Description:
    "${jobDescription}"
    
    Candidate Resume:
    "${resumeText}"
    
    Output strictly in JSON format.
    1. Calculate a harsh but fair 'matchScore' (0-100).
    2. Identify critical 'missingKeywords' that would cause an ATS (Applicant Tracking System) to auto-reject this resume.
    3. Pick 3 specific bullet points or sentences that are weak, vague, or cliché. Provide the 'original' text, your 'feedback' on why it sucks, and a 'rewritten' version that is quantified, action-oriented, and impressive.
    4. Provide a 'roastComment': a one or two-sentence summary that is brutally honest and slightly funny about why you might pass on this candidate.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Using Flash for speed, sufficiently smart for text analysis
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are a brutally honest hiring manager. Do not sugarcoat anything.",
        temperature: 0.7, 
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from AI.");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};