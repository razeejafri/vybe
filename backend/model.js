import "dotenv/config";
import fetch from "node-fetch";

async function listModels() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GOOGLE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    console.log("Available models:\n");
    data.models.forEach((m) => {
      console.log(`- ${m.name} | supported methods: ${m.supportedGenerationMethods}`);
    });
  } catch (err) {
    console.error("Error listing models:", err.message);
  }
}

listModels();
