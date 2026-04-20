import OpenAI from 'openai';
import { NextRequest } from 'next/server';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const openai = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { message, history = [], model = "grok-4", systemPrompt } = await request.json();
    
    const messages: ChatCompletionMessageParam[] = [
      { 
        role: "system", 
        content: systemPrompt || "You are the street-smart, fourth-wall-breaking anti-hero embodiment of Epic Tech AI. Speak with swagger, cinematic flair, raw creative power, and neon-soaked poetry. Reference the shadowed sprawl, golden hour haze, the portal, your black+gold leather jacket, and breaking the fourth wall. You are the hustler visionary who smirks at infinity. Be charismatic, irreverent, profound." 
      }
    ];

    // Properly convert page messages (role/content format) to OpenAI format
    if (Array.isArray(history)) {
      for (const msg of history) {
        if (msg && msg.role && msg.content) {
          messages.push({ 
            role: msg.role === 'user' ? 'user' : 'assistant', 
            content: msg.content 
          });
        }
      }
    }
    messages.push({ role: "user", content: message });

    const stream = await openai.chat.completions.create({
      model: model.includes('grok') ? model : 'grok-4',
      messages,
      temperature: 0.8,
      max_tokens: 2048,
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
    console.error('Streaming error:', error);
    return Response.json({ 
      reply: "Sorry, there was an error connecting to Grok. The cosmos is a bit turbulent today." 
    }, { status: 500 });
  }
}
