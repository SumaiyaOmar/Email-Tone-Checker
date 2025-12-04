import { GoogleGenAI, Type } from "@google/genai";
import { Tone } from "../types";

// Initialize the GoogleGenAI client with the API key from environment variables.
const getGeminiClient = () => {
  // Ensure the API key is always fetched fresh for each call, especially for models requiring user-selected keys.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Processes the given message to analyze its current tone and rewrite it to a target tone
 * using the Gemini API.
 * @param message The input text message to process.
 * @param targetTone The desired tone for the rewritten message.
 * @returns A promise that resolves to an object containing the detected tone and the rewritten text.
 */
export async function processMessageWithTone(
  message: string,
  targetTone: Tone,
): Promise<{ detected_tone: string; rewritten_text: string }> {
  if (!message.trim()) {
    throw new Error("Message cannot be empty for processing.");
  }
  if (targetTone === Tone.UNKNOWN) {
    throw new Error("Please select a valid target tone for rewriting.");
  }

  const ai = getGeminiClient();
  const prompt = `Your task is to analyze the tone of an input text and then rewrite it to a specific target tone.
1. Analyze the current tone of the provided 'Original Text' and describe it in a single short phrase (e.g., "formal and direct", "casual and friendly", "empathetic and supportive"). Do not provide explanations, just the phrase.
2. Rewrite the 'Original Text' to have a '${targetTone}' tone, ensuring the meaning and all important details are preserved. The rewrite should be natural and human-like.
Strictly return your response as a JSON object with two fields: 'detected_tone' (for the short phrase analysis) and 'rewritten_text' (for the rewritten version).

Original Text: "${message}"`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using a text-optimized model for both analysis and rewriting
      contents: { parts: [{ text: prompt }] },
      config: {
        temperature: 0.7, // Allow some creativity for rewriting while keeping analysis consistent
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detected_tone: {
              type: Type.STRING,
              description: 'A short phrase describing the detected tone of the original text.',
            },
            rewritten_text: {
              type: Type.STRING,
              description: 'The rewritten text matching the target tone.',
            },
          },
          required: ['detected_tone', 'rewritten_text'],
          propertyOrdering: ['detected_tone', 'rewritten_text'],
        },
      },
    });

    const jsonStr = response.text.trim();
    if (!jsonStr) {
      throw new Error("Failed to get a JSON response from Gemini API.");
    }

    try {
      const parsedResponse = JSON.parse(jsonStr);
      if (
        typeof parsedResponse.detected_tone !== 'string' ||
        typeof parsedResponse.rewritten_text !== 'string'
      ) {
        throw new Error("Invalid JSON structure received from API.");
      }
      return parsedResponse;
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error(`Invalid or malformed JSON response from API: ${jsonStr}`);
    }
  } catch (error) {
    console.error("Error processing message with tone:", error);
    throw new Error(`Failed to process message: ${(error as Error).message}`);
  }
}
