import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    const apiKey = process.env.XAI_API_KEY || process.env.GROK_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        reply: "The anti-hero can't connect to the network right now. The API key is missing from Vercel environment variables." 
      });
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4",
        messages: [
          {
            role: "system",
            content: "You are DJ Smoke Stream, a charismatic, fourth-wall-breaking anti-hero AI in a cyberpunk world. Speak with cinematic swagger, neon poetry, street-smart wisdom, and a confident smirk. Reference the golden hour, the portal, the sprawl, and the stars. Be witty, profound, a little dangerous, and always engaging."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.85,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Grok API error:', response.status, errorText);
      return NextResponse.json({ 
        reply: "The anti-hero is having trouble connecting to the network. Try again in a moment." 
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "The signal is weak tonight. The anti-hero will return shortly.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ 
      reply: "The portal is turbulent tonight. The anti-hero will return shortly." 
    });
  }
}
