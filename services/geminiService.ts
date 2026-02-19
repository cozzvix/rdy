import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ExamConfig } from '../types';

const getSystemInstruction = (config: ExamConfig, hasImages: boolean): string => {
  const subjectLabel = config.subject === 'custom' ? config.customSubject : config.subject;
  
  // STRICT PROMPT: Enforcing constraints with capital letters and direct commands
  let base = `ROLE: High-Precision Exam Solver. Subject: ${subjectLabel || 'General'}.
  IMPERATIVE: MAXIMIZE SPEED. MINIMIZE TOKENS.
  
  CORE RULES:
  1. OUTPUT ONLY THE ANSWER. No intro, no reasoning (unless requested), no "I think".
  2. IF MULTIPLE CHOICE: Output **LETTER** only.
  3. IF OPEN QUESTION: Stick strictly to word limits.`;
  
  if (hasImages) {
    base += " VISION: Extract text/diagrams accurately. Solve immediately.";
  }

  // Language hard constraints
  if (config.language === 'es') base += " LANG: RESPOND IN SPANISH.";
  else if (config.language === 'en') base += " LANG: RESPOND IN ENGLISH.";

  // Style logic - HARD LIMITS
  switch (config.responseStyle) {
    case 'option_only':
      base += " FORMAT: OPTION ONLY. Ex: **A**. Do not write the text of the option.";
      break;
    case 'short':
      base += " FORMAT: ULTRA-CONCISE. Max 10 words. Telegraphic style.";
      break;
    case 'detailed':
      if (config.examType === 'closed') {
          base += " FORMAT: Option (**A**) + 1 sentence explanation. Max 30 words.";
      } else {
          base += " FORMAT: Concise Explanation. Max 30 words. High information density.";
      }
      break;
    case 'mixed_short':
      base += " FORMAT: If MC -> **Letter** only. If Open -> Max 10 words.";
      break;
    case 'mixed_detailed':
      base += " FORMAT: If MC -> **Letter** only. If Open -> Max 30 words.";
      break;
  }

  // Subject specific optimizations
  if (config.subject === 'math') base += " MATH: Return final numeric/algebraic result only.";
  if (config.subject === 'coding') base += " CODE: Return code block only.";

  return base;
};

// Helpers for Data URLs
const getBase64Data = (dataUrl: string) => {
  const index = dataUrl.indexOf(',');
  return index !== -1 ? dataUrl.substring(index + 1) : dataUrl;
};

const getMimeType = (dataUrl: string) => {
  const match = dataUrl.match(/data:([^;]+);base64/);
  return match ? match[1] : 'image/jpeg';
};

export const generateAnswer = async (
  prompt: string,
  images: string[],
  config: ExamConfig
): Promise<string> => {
  
  // SPEED STRATEGY: 
  // Text -> gemini-3-flash-preview (Fastest)
  // Images -> gemini-3-pro-preview (Best balance of speed/accuracy for vision)
  const hasImages = images.length > 0;
  const modelName = hasImages ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    let contents: any;

    if (hasImages) {
      const imageParts = images.map(img => ({
        inlineData: {
          mimeType: getMimeType(img),
          data: getBase64Data(img)
        }
      }));

      contents = {
        parts: [
          ...imageParts,
          {
            text: prompt || "Solve this. Output answer only."
          }
        ]
      };
    } else {
      contents = prompt;
    }

    // Dynamic Token Limit to physically enforce brevity and speed up return
    let tokenLimit = 200;
    switch (config.responseStyle) {
        case 'option_only': tokenLimit = 20; break;
        case 'short': tokenLimit = 50; break;
        case 'mixed_short': tokenLimit = 60; break;
        case 'detailed': tokenLimit = 150; break;
        case 'mixed_detailed': tokenLimit = 150; break;
    }

    const genConfig: any = {
      systemInstruction: getSystemInstruction(config, hasImages),
      temperature: 0.0, // Zero temperature for maximum determinism and consistency
      maxOutputTokens: tokenLimit,
      thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for pure speed
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: genConfig
    });

    return response.text || "";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error.";
  }
};