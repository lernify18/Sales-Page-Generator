
import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedScript } from '../types';

export async function generateScript(productTitle: string): Promise<GeneratedScript> {
  // Safe retrieval of API key
  let apiKey: string | undefined;
  try {
    apiKey = process.env.API_KEY;
  } catch (e) {
    apiKey = undefined;
  }
  
  if (!apiKey) {
    throw new Error("API_KEY tidak dijumpai. Sila pastikan anda telah menetapkan Environment Variable 'API_KEY' di dashboard Netlify anda.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Generate a complete set of WhatsApp closing scripts for a product called "${productTitle}".
    The scripts must be in casual but persuasive Bahasa Melayu, proven to convert sales in Malaysia.
    Follow the exact structured flow provided.
    Use ✅ emojis for lists of features and offers.
    Include image placeholders with specific labels: "Product Poster", "Testimonial Proof", "Shipping Proof", "Grand Promo Poster".
    Each message must be ready to be copied and pasted into WhatsApp. Ensure the output is a valid JSON object matching the provided schema.
    
    The flow MUST include: 
    1. Intro
    2. Testimonial (Round 1)
    3. Suggest Solution
    4. Testimonial (Round 2)
    5. Product Info
    6. Harga Offer (Main Offer)
    7. Upsell Package
    8. Bank Account Details
    9. Proof of Posting
    10. Follow-Up Scripts (Day 1–5 Softselling)
    11. 10 Testimonial Follow-Ups
    12. 10 Grand Promo Follow-Ups
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
                    description: "The title of the script section (e.g., 'Intro')."
                  },
                  messages: {
                    type: Type.ARRAY,
                    description: "An array of messages or image placeholders.",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        type: {
                          type: Type.STRING,
                          description: "Either 'text' or 'image'."
                        },
                        content: {
                          type: Type.STRING,
                          description: "The text message or image label."
                        }
                      },
                      required: ['type', 'content'],
                      propertyOrdering: ['type', 'content']
                    }
                  }
                },
                required: ['title', 'messages'],
                propertyOrdering: ['title', 'messages']
              }
            }
          },
          required: ['script'],
          propertyOrdering: ['script']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Tiada respon daripada AI. Sila cuba lagi.");
    }

    const jsonResponse = JSON.parse(text.trim());
    return jsonResponse.script as GeneratedScript;
  } catch (e: any) {
    console.error("AI Generation failed:", e);
    
    // Handle specific API errors
    if (e.message?.includes('403') || e.message?.includes('API key')) {
      throw new Error("API Key tidak sah atau telah tamat tempoh. Sila periksa tetapan API Key anda.");
    }
    
    if (e.message?.includes('429')) {
      throw new Error("Terlalu banyak permintaan. Sila tunggu sebentar dan cuba lagi.");
    }

    throw new Error(e.message || "Gagal menjana skrip. Sila pastikan sambungan internet anda stabil.");
  }
}
