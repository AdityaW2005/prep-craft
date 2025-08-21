import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Generate a multiple-choice quiz from the following text. Each question should have 4 options and a correct answer. Return the quiz as a JSON object with an array of questions. Each question object should have "question", "options" (an array of strings), and "answer" properties. Text: ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const quizText = response.text();

    // Clean the response to ensure it's valid JSON
    const jsonText = quizText.replace(/```json/g, '').replace(/```/g, '').trim();
    const quiz = JSON.parse(jsonText);

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Error generating quiz' },
      { status: 500 },
    );
  }
}
