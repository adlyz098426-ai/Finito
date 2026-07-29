import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client server-side
  const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY non configurada");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Route: AI Episode Recap (Resumen sin Spoilers)
  app.post("/api/ai/recap", async (req, res) => {
    try {
      const { showTitle, season, episode } = req.body;
      if (!showTitle) {
        return res.status(400).json({ error: "Título de la serie es requerido" });
      }

      const ai = getAi();
      const prompt = `Eres un experto asistente de contenido de Netflix. El usuario quiere un resumen conciso y LIBRE DE SPOILERS antes de comenzar a ver la Temporada ${season || 1}, Episodio ${episode || 1} de la serie "${showTitle}". 
Proporciona:
1. "En el capítulo anterior / Temporada anterior": 3 viñetas clave de lo sucedido antes.
2. "Puntos a tener en cuenta": 2 detalles o personajes clave para recordar.
3. "Sinopsis del episodio actual (Sin Spoilers)": 2 oraciones para preparar la expectativa.

Responde con tono emocionante y en español claro. Mantenlo breve y bien estructurado en formato Markdown.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({ recap: response.text });
    } catch (error: any) {
      console.error("Error in AI recap:", error);
      res.status(500).json({ error: error.message || "Error al generar el resumen de la serie" });
    }
  });

  // API Route: AI Smart Show Recommendations
  app.post("/api/ai/recommendations", async (req, res) => {
    try {
      const { watchlistTitles, favoriteGenres, mood } = req.body;
      const ai = getAi();

      const prompt = `Eres el recomendador inteligente de Netflix.
Series que le gustan o sigue el usuario: ${watchlistTitles ? watchlistTitles.join(", ") : "Ninguna especificada"}.
Géneros preferidos: ${favoriteGenres ? favoriteGenres.join(", ") : "Variados"}.
Ánimo o preferencia actual: ${mood || "Series adictivas con grandes giros"}.

Genera exactamente 3 recomendaciones de series disponibles en Netflix con esta estructura JSON:
[
  {
    "title": "Nombre de la serie",
    "genre": "Género principal",
    "seasonsCount": "Número de temporadas",
    "matchScore": "Porcentaje de coincidencia (ej: 98%)",
    "reason": "Explicación de por qué le gustará basada en sus gustos",
    "tagline": "Frase enganchadora"
  }
]
Retorna SOLO el JSON estructurado válido, nada de texto extra.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      let recommendations = [];
      try {
        recommendations = JSON.parse(response.text || "[]");
      } catch (e) {
        console.error("Failed to parse JSON recommendations", response.text);
      }

      res.json({ recommendations });
    } catch (error: any) {
      console.error("Error in AI recommendations:", error);
      res.status(500).json({ error: error.message || "Error al obtener recomendaciones" });
    }
  });

  // API Route: AI Release Hype & Episode Prediction
  app.post("/api/ai/hype", async (req, res) => {
    try {
      const { showTitle } = req.body;
      const ai = getAi();

      const prompt = `Proporciona un reporte de novedades y teorías de estreno para la serie de Netflix "${showTitle}".
Incluye:
- Estado actual de producción o emisión.
- Lo que dicen las teorías o anuncios oficiales para el próximo episodio / temporada.
- Qué pueden esperar los fans del próximo estreno.

Mantenlo entusiasta, profesional, en español y breve (2 párrafos).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({ hype: response.text });
    } catch (error: any) {
      console.error("Error in AI hype:", error);
      res.status(500).json({ error: error.message || "Error al generar novedades" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Netflix Series Tracker API" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
