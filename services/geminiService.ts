
import { GoogleGenAI } from "@google/genai";

export const getShippingAdvice = async (packageDesc: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Actúa como un experto en logística de carga en Colombia. El usuario quiere enviar lo siguiente desde San José del Guaviare: "${packageDesc}". Brinda un consejo muy breve (máximo 40 palabras) sobre cómo embalarlo de forma segura y una estimación de si es un producto delicado.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Asegúrate de embalar bien tu paquete con plástico burbuja si es frágil.";
  }
};

export const estimateDistance = async (destinationCity: string): Promise<{ distanceKm: number; explanation: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `¿Cuál es la distancia terrestre aproximada en kilómetros para un envío de carga desde San José del Guaviare (Guaviare) hasta ${destinationCity}? Responde únicamente con el número de kilómetros (solo el número).`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: 2.5668,
              longitude: -72.6428
            }
          }
        }
      },
    });

    const text = response.text || "";
    const match = text.match(/\d+/);
    const distanceKm = match ? parseInt(match[0], 10) : 400;

    return {
      distanceKm,
      explanation: `Distancia calculada desde San José del Guaviare.`
    };
  } catch (error) {
    console.error("Distance Error:", error);
    return { distanceKm: 400, explanation: "Error calculando distancia. Usando promedio regional." };
  }
};
