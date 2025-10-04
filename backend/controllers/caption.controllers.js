import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Initialize Google Generative AI SDK with API key
 */
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Use Gemini multimodal model (2.5-flash is vision-enabled)
const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

/**
 * Generate a short social media caption using Gemini Vision model.
 */
const generateCaption = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No media file uploaded" });

    console.log("Uploaded file:", file);

    // Read image as base64
    const imageBuffer = fs.readFileSync(file.path);

    // Send prompt + image to Gemini
    const result = await model.generateContent([
      "Generate a short, catchy social media caption for this image.",
      {
        inlineData: {
          mimeType: file.mimetype,
          data: imageBuffer.toString("base64"),
        },
      },
    ]);

    let caption = result.response.text().trim();

    // Extract first "Option" if exists
    const optionMatch = caption.match(/Option\s*1.*?:\s*(.*?)(?=Option\s*\d|$)/s);
    if (optionMatch) {
      caption = optionMatch[1].trim();
    } else {
      // Fallback: pick first non-empty line
      const lines = caption.split("\n").map(l => l.trim()).filter(l => l.length > 0);
      caption = lines[0] || "Nice post!";
    }

    // Clean unwanted characters: asterisks, angle brackets, extra hashtags at the end
    caption = caption.replace(/[*<>]/g, "").trim();

    // Clean up uploaded file
    fs.unlink(file.path, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });

    return res.json({ caption });
  } catch (err) {
    console.error("Caption generation error:", err);
    return res.status(500).json({ message: "Failed to generate caption" });
  }
};

export default generateCaption;
