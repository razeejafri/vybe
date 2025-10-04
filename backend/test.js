import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function test() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: "Write a short caption for a cute cat picture." }]
    });
    console.log("Caption:", response.choices[0].message.content);
  } catch (err) {
    console.error("OpenAI error:", err);
  }
}

test();
