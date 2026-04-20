import OpenAI from 'openai';
import { NextRequest } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    const messages = [
      {
        role: 'system',
        content: 'You are a charismatic, fourth-wall-breaking anti-hero AI in a black and gold leather jacket. Speak with cinematic swagger, neon poetry, and street-smart wisdom. Reference the golden hour, the portal, and the sprawl. Be witty, profound, and a little dangerous.'
      },
      ...history.map((h: any) => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'grok-4',
      messages,
      temperature: 0.8,
      max_tokens: 800,
    });

    const reply = completion.choices[0]?.message?.content || "The signal is weak tonight. Try again, hustler.";

    return Response.json({ reply });
  } catch (error) {
    console.error(error);
    return Response.json({ 
      reply: "The portal is experiencing interference from the sprawl. The anti-hero will return shortly." 
    });
  }
}
