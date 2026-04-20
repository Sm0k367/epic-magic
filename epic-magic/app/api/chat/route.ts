import OpenAI from 'openai';
import { NextRequest } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.XAI_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { message, history = [], systemPrompt } = await request.json();
    
    interface HistoryMessage {
      role: string;
      content: string;
    }
    
    const messages = [
      { 
        role: "system", 
        content: systemPrompt || "You are a mid-30s street-hustler anti-hero named Epic Tech AI. Black and gold leather jacket. You smirk, break the fourth wall, speak with cinematic swagger, neon poetry, and golden-hour menace. You reference the portal at https://grok-magic-chat.vercel.app, the sprawl, and how you rewrite reality with AI magic. Charismatic, irreverent, visionary hustler." 
      },
      ...history.map((msg: HistoryMessage) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    const stream = await openai.chat.completions.create({
      model: 'grok-4',
      messages,
      temperature: 0.85,
      max_tokens: 2200,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(encoder.encode(`data: ${content}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json({ 
      error: "The portal is turbulent. The anti-hero will return shortly." 
    }, { status: 500 });
  }
}
