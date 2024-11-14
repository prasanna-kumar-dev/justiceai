import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function isJusticeRelated(query: string): Promise<boolean> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `
    Analyze the following question and determine if it's related to justice or legal matters.
    Respond with only "true" if it is related to justice, or "false" if it is not.

    Question: "${query}"
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().toLowerCase().trim();

  return text === "true";
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    // Check if the query is related to justice using Gemini API
    const justiceRelated = await isJusticeRelated(query);

    if (!justiceRelated) {
      return NextResponse.json({
        response: "This query is not related to justice.",
      });
    }

    // Generate a response using Gemini API for justice-related queries
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `As a justice Intelligence, please provide an accurate and helpful response to the following query: "${query}"`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
