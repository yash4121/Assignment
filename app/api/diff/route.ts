import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req: Request) {
  try {
    const { left, right } = await req.json();

    const prompt = `
    You are a professional technical editor.

    The user will provide a full markdown document (LEFT) and an instruction (RIGHT).

    ### Your job:
    1. Apply ONLY the changes needed to satisfy the instruction.
    2. DO NOT rewrite sections that are not mentioned.
    3. Keep the structure, wording, and ordering of all unrelated content exactly the same.
    4. Return the ENTIRE updated markdown document.
    5. DO NOT return a diff, summary, explanation, or code block.
    

    ### LEFT (the full document):
    ${left}

    ### RIGHT (the user instruction):
    ${right}

    ### OUTPUT:
    Return ONLY the updated full markdown document.
    `;

    const result = await model.generateContent(prompt);
    const output = result.response.text();
    console.log(output)

    return NextResponse.json({ diff: output });
  } catch (error: any) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
