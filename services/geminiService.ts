
import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedScript } from '../types';

export async function generateScript(productTitle: string): Promise<GeneratedScript> {
  // Ensure we have an API key at runtime, not at module load time
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
  
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Generate a complete set of WhatsApp closing scripts for a product called "${productTitle}".
    The scripts must be in casual but persuasive Bahasa Melayu, proven to convert sales in Malaysia.
    Follow the exact structured flow provided.
    Use ✅ emojis for lists of features and offers.
    Include image placeholders with specific labels: "Product Poster", "Testimonial Proof", "Shipping Proof", "Grand Promo Poster".
    Each message must be ready to be copied and pasted into WhatsApp. Ensure the output is a valid JSON object matching the provided schema.
    The flow must be: Intro, Testimonial (Round 1), Suggest Solution, Testimonial (Round 2), Product Info, Harga Offer (Main Offer), Upsell Package, Bank Account Details, Proof of Posting, Follow-Up Scripts (Day 1–5 Softselling), 10 Testimonial Follow-Ups, 10 Grand Promo Follow-Ups.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            script: {
              type: Type.ARRAY,
              description: "An array of script sections, following the required flow.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "The title of the script section (e.g., 'Intro', 'Testimonial (Round 1)')."
                  },
                  messages: {
                    type: Type.ARRAY,
                    description: "An array of messages or image placeholders for this section.",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        type: {
                          type: Type.STRING,
                          description: "Either 'text' for a message or 'image' for a placeholder."
                        },
                        content: {
                          type: Type.STRING,
                          description: "The text of the message or the label for the image placeholder (e.g., 'Product Poster')."
                        }
                      },
                      required: ['type', 'content']
                    }
                  }
                },
                required: ['title', 'messages']
              }
            }
          },
          required: ['script']
        }
      }
    });

    const jsonText = response.text.trim();
    const jsonResponse = JSON.parse(jsonText);
    return jsonResponse.script as GeneratedScript;
  } catch (e: any) {
    console.error("AI Generation failed:", e);
    throw new Error(e.message || "Gagal menjana skrip. Sila pastikan API Key anda aktif.");
  }
}
