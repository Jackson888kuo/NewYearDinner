import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FullMenu } from "../types";

// Schema definition for the menu structure
const menuSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    soup: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              price: { type: Type.NUMBER, nullable: true },
            }
          }
        },
        required: { type: Type.BOOLEAN },
        multiSelect: { type: Type.BOOLEAN }
      }
    },
    appetizer: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              price: { type: Type.NUMBER, nullable: true },
            }
          }
        },
        required: { type: Type.BOOLEAN },
        multiSelect: { type: Type.BOOLEAN }
      }
    },
    main: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              price: { type: Type.NUMBER, nullable: true },
            }
          }
        },
        required: { type: Type.BOOLEAN },
        multiSelect: { type: Type.BOOLEAN }
      }
    },
    aLaCarte: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              price: { type: Type.NUMBER, nullable: true },
            }
          }
        },
        required: { type: Type.BOOLEAN },
        multiSelect: { type: Type.BOOLEAN }
      }
    }
  }
};

export const parseMenuImage = async (base64Image: string): Promise<FullMenu | null> => {
  if (!process.env.API_KEY) {
    console.error("API Key missing");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Clean base64 string if it contains data prefix
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: cleanBase64
          }
        },
        {
          text: "Analyze this menu image. Extract the menu items into categories: soup, appetizer, main, and aLaCarte. For the 'main' category, include all main courses. Assign a unique short ID to each item. Include prices as numbers if visible. Return pure JSON matching the schema."
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: menuSchema,
        systemInstruction: "You are a data extraction assistant specialized in digitizing restaurant menus. Be precise with prices and names."
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text) as FullMenu;
      // Ensure logic flags are set correctly if the AI guessed wrong
      parsed.soup.required = true;
      parsed.soup.multiSelect = false;
      parsed.appetizer.required = true;
      parsed.appetizer.multiSelect = false;
      parsed.main.required = true;
      parsed.main.multiSelect = false;
      parsed.aLaCarte.required = false;
      parsed.aLaCarte.multiSelect = true;
      return parsed;
    }
    return null;

  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    throw error;
  }
};