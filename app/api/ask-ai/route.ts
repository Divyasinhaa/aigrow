// app/api/ask-ai/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST request handler
export async function POST(req: Request) {
  try {
    const { prompt } = await req.json(); // get prompt from request body

    if (!prompt) {
      return NextResponse.json({ reply: "Prompt is required." }, { status: 400 });
    }

    // Call OpenAI Chat Completion API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
    });

    const reply = completion.choices[0].message.content;

    // Return response to frontend
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("OpenAI Error:", error);
    return NextResponse.json({ reply: "Error generating response." }, { status: 500 });
  }
}
