
import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedScript } from '../types';

// Function to generate closing scripts using Gemini API
export async function generateScript(productTitle: string): Promise<GeneratedScript> {
  // Always use process.env.API_KEY directly.
  if (!process.env.API_KEY) {
    throw new Error("API Key tidak dijumpai. Sila pastikan anda telah memilih API Key melalui butang yang disediakan.");
  }

  // Create a new instance right before the call to ensure it uses the current key from process.env.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
              description: "An array of script sections.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "Title of the section."
                  },
                  messages: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        type: { type: Type.STRING },
                        content: { type: Type.STRING }
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

    // Access the .text property directly to get the generated content
    const text = response.text;
    if (!text) throw new Error("Tiada respon daripada AI.");

    const jsonResponse = JSON.parse(text.trim());
    return jsonResponse.script as GeneratedScript;
  } catch (e: any) {
    console.error("AI Generation failed:", e);
    
    if (e.message?.includes('403') || e.message?.includes('API key')) {
      throw new Error("API Key tidak sah atau tidak dibenarkan. Sila periksa tetapan API anda.");
    }
    
    if (e.message?.includes('429')) {
      throw new Error("Had penggunaan dicapai. Sila tunggu seminit dan cuba lagi.");
    }

    throw new Error(e.message || "Gagal menjana skrip. Sila cuba lagi sebentar.");
  }
}
