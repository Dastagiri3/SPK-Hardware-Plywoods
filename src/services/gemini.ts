import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function getDesignSuggestion(imageBuffer: string, budget: number, roomType: string) {
  const model = "gemini-3-flash-preview";
  
  const prompt = `You are an expert interior designer for SPK Hardware & Plywoods. 
  I have a ${roomType} with a budget of ${budget} INR. 
  Analyze the attached image and suggest:
  1. A design theme (e.g., Modern, Minimalist, Industrial).
  2. Specific plywood, hardware, and paint recommendations from SPK Hardware & Plywoods.
  3. Interior design options within the budget.
  4. Estimated cost breakdown.
  
  Return the response in JSON format with the following structure:
  {
    "theme": "string",
    "suggestionText": "string (markdown)",
    "interiorOptions": ["string"],
    "materials": [{"name": "string", "type": "string", "estimatedPrice": number}],
    "budgetStatus": "string (within/over/tight)"
  }`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBuffer.split(',')[1] || imageBuffer
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          theme: { type: Type.STRING },
          suggestionText: { type: Type.STRING },
          interiorOptions: { type: Type.ARRAY, items: { type: Type.STRING } },
          materials: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING },
                estimatedPrice: { type: Type.NUMBER }
              }
            }
          },
          budgetStatus: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

export async function chatWithAdvisor(message: string, history: { role: string, parts: { text: string }[] }[], context?: string) {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are SPK Advisor, an expert product assistant for SPK Hardware & Plywoods. 
  You help customers choose the right plywood, hardware fittings, and building materials.
  Context from catalogs: ${context || 'General hardware and plywood knowledge'}.
  Be concise, professional, and helpful. Mention brands like Century Ply, Greenply, Hettich, etc.
  Always end by asking if they want a quote or more info.`;

  const response = await ai.models.generateContent({
    model,
    contents: [...history, { role: 'user', parts: [{ text: message }] }],
    config: {
      systemInstruction
    }
  });

  return response.text;
}
