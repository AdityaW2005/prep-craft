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

    const prompt = `Generate flashcards from the following text. Each flashcard should have a "term" and a "definition". Return the flashcards as a JSON object with an array of flashcards. Text: ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const flashcardsText = response.text();

    // Clean the response to ensure it's valid JSON
    const jsonText = flashcardsText.replace(/```json/g, '').replace(/```/g, '').trim();
    const flashcards = JSON.parse(jsonText);

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json(
      { error: 'Error generating flashcards' },
      { status: 500 },
    );
  }
}
