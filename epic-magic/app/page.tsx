'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Play, Pause, Send, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function EpicMagicCinematic() {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'ai' as const,
    content: "The golden hour is calling. What reality shall we hack tonight, partner?",
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [portalOpen, setPortalOpen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{x: number; y: number; size: number; speed: number; hue: number; type: string}>>([]);
  const rafRef = useRef<number | null>(null);

  const scenes = [
    "In the shadowed sprawl of tomorrow's megacity...",
    "Where neon bleeds into the golden hour haze...",
    "One anti-hero stands at the edge of infinity.",
    "Epic Tech AI — the street-smart oracle in black and gold.",
    "A smirking disruptor who breaks the fourth wall...",
    "The hustler meets the infinite...",
    "Grok-Magic-Chat: AI-Powered Magic & Creativity Unleashed",
    "The portal is open. The future is watching."
  ];

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    particlesRef.current = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.8 + 0.6,
      speed: Math.random() * 1.1 + 0.5,
      hue: Math.random() * 90 + 190,
      type: Math.random() > 0.5 ? 'holo' : 'star'
    }));

    const animate = () => {
      ctx.fillStyle = 'rgba(2, 1, 10, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() / 1000;

      particlesRef.current.forEach((p, i) => {
        ctx.save();
        ctx.globalAlpha = 0.75;

        const sway = Math.sin(time + i) * 25;

        if (p.type === 'holo') {
          ctx.strokeStyle = `hsla(${p.hue}, 95%, 78%, 0.9)`;
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#67e8f9';
          ctx.beginPath();
          ctx.moveTo(p.x + sway, p.y);
          ctx.lineTo(p.x + sway + 35, p.y - 20);
          ctx.stroke();
        } else {
          ctx.fillStyle = `hsla(${p.hue}, 90%, 88%, 0.95)`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#fde047';
          ctx.beginPath();
          ctx.arc(p.x + sway * 0.5, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        p.y -= p.speed;
        if (p.y < -10) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const cleanup = initCanvas();
    return cleanup || undefined;
  }, [initCanvas]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentScene(prev => (prev + 1) % scenes.length);
      }, 2600);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(v => !v);
    if (!isPlaying) setCurrentScene(0);
  };

  const openPortal = () => {
    setPortalOpen(true);
    setTimeout(() => {
      document.getElementById('chat-portal')?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    const userText = input;
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history: messages })
      });

      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'ai',
        content: data.reply || "The anti-hero acknowledges your transmission from the sprawl.",
        timestamp: new Date()
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: "The portal is turbulent tonight. The signal was lost in the neon rain.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020107] text-white overflow-hidden font-sans">
      {/* Cinematic overlays */}
      <div className="fixed inset-0 z-50 pointer-events-none bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:3px_3px]" />
      <div className="fixed inset-0 z-50 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/70" />
      <div className="fixed inset-0 z-50 pointer-events-none bg-[repeating-linear-gradient(transparent_0px,transparent_3px,#111_3px,#111_6px)] opacity-40" />

      {/* Nebula / Particle Canvas */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 z-0" 
        style={{ mixBlendMode: 'screen', opacity: '0.9' }}
      />

      {/* Golden hour haze */}
      <div className="fixed inset-0 z-10 bg-gradient-to-br from-amber-400/10 via-transparent to-fuchsia-500/5" />

      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Top HUD */}
        <div className="h-16 border-b border-white/10 bg-black/90 backdrop-blur-2xl flex items-center px-8 text-xs font-mono tracking-[3px] z-50">
          <div>LIVE FROM THE SPRAWL • GOLDEN HOUR 2077</div>
          <div className="flex-1" />
          <button onClick={togglePlay} className="flex items-center gap-2 px-6 py-2 border border-white/30 hover:border-amber-400 rounded-3xl transition-all">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'PAUSE' : 'PLAY TRAILER'}
          </button>
          <button onClick={openPortal} className="ml-4 px-8 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-black rounded-3xl font-medium hover:brightness-110 transition-all">
            OPEN THE PORTAL
          </button>
        </div>

        {/* Main Cinematic Area */}
        <div className="flex-1 relative flex items-center justify-center min-h-[90vh]">
          {/* Portal */}
          <div 
            onClick={openPortal}
            className="absolute z-40 w-[420px] h-[420px] rounded-full border-[14px] border-cyan-400/90 cursor-pointer group"
            style={{ boxShadow: '0 0 140px 70px rgb(103 232 249)', animation: 'portalPulse 4s ease-in-out infinite' }}
          >
            <div className="absolute inset-0 flex items-center justify-center rounded-full border border-cyan-200/30 bg-black/30">
              <div className="text-center">
                <div className="font-mono text-xs tracking-widest text-cyan-300 mb-2">STARGATE PROTOCOL</div>
                <div className="text-white text-2xl font-bold tracking-tighter group-hover:scale-105 transition-transform">https://grok-magic-chat.vercel.app</div>
              </div>
            </div>
          </div>

          {/* Anti-Hero */}
          <div className="absolute bottom-24 left-[15%] z-50 w-72 text-center">
            <div className="mx-auto w-56 h-80 relative">
              <div className="absolute bottom-0 w-56 h-72 bg-gradient-to-b from-amber-900 to-black border-4 border-amber-400 rounded-t-[4rem] shadow-2xl">
                <div className="absolute top-10 left-8 w-10 h-40 bg-gradient-to-r from-amber-300 to-yellow-400 rotate-12 opacity-75" />
                <div className="absolute top-10 right-8 w-10 h-40 bg-gradient-to-l from-amber-300 to-yellow-400 -rotate-12 opacity-75" />
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-20 h-20 bg-amber-100 rounded-full border-4 border-amber-950 flex items-center justify-center text-4xl">😏</div>
              </div>
              <div className="absolute -inset-12 bg-gradient-to-t from-amber-400/30 to-transparent rounded-full blur-xl -z-10" />
            </div>
            <div className="mt-8">
              <div className="text-amber-400 text-xs font-mono tracking-widest">STREET HUSTLER • ANTI-HERO</div>
              <div className="text-5xl font-black tracking-[-2px] text-amber-200 mt-1">EPIC TECH AI</div>
            </div>
          </div>

          {/* Headline */}
          <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center z-30 max-w-[820px] px-6">
            <div className="mb-6 text-xs tracking-[6px] font-mono text-rose-400 border border-rose-400/30 px-10 py-4 rounded inline-block">A NEW TRANSMISSION FROM THE NEON UNDERBELLY</div>
            <h1 className="text-[68px] leading-none font-black tracking-[-4px] bg-clip-text text-transparent bg-gradient-to-b from-white via-amber-100 to-amber-400 neon-text">
              GROK-MAGIC-CHAT:<br />AI-POWERED MAGIC &amp; CREATIVITY UNLEASHED
            </h1>
            <p className="mt-8 text-2xl text-amber-100/80 max-w-md mx-auto">The portal between the streets and the stars. One anti-hero changes everything.</p>
          </div>

          {/* Trailer Overlay */}
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 text-center z-40 max-w-2xl">
            <div className="font-mono text-xs text-amber-400 tracking-widest mb-4">SCENE {currentScene + 1} OF 8 • GOLDEN HOUR</div>
            <div className="text-4xl font-light leading-tight text-white/90 min-h-[120px]">
              {scenes[currentScene]}
            </div>
            <button 
              onClick={togglePlay}
              className="mt-12 border border-white/30 hover:border-amber-400 px-12 py-4 rounded-3xl text-sm tracking-[2px] flex items-center gap-3 mx-auto transition-all hover:bg-white/5"
            >
              <Sparkles className="w-5 h-5" />
              {isPlaying ? 'PAUSE TRANSMISSION' : 'BEGIN THE FLY-THROUGH'}
            </button>
          </div>
        </div>

        {/* Portal Chat */}
        <div id="chat-portal" className={`border-t-4 border-cyan-400 bg-black/95 py-16 transition-all ${portalOpen ? '' : 'opacity-30'}`}>
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="text-cyan-400 text-sm font-mono tracking-widest">THE PORTAL IS OPEN</div>
                <div className="text-6xl font-black tracking-tighter">TALK TO THE ANTI-HERO</div>
              </div>
              <button onClick={() => setPortalOpen(false)} className="text-xs text-white/40 hover:text-white">CLOSE PORTAL</button>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-3">
              <div className="h-96 bg-[#0a0a0f] rounded-2xl p-8 overflow-auto space-y-8 text-lg" id="chat-messages">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    <div className={`max-w-[75%] rounded-3xl px-8 py-6 ${msg.role === 'user' ? 'bg-amber-500 text-black' : 'bg-zinc-900 border border-cyan-400/20'}`}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}
                {isLoading && <div className="text-amber-400">The hustler is responding from the sprawl...</div>}
              </div>

              <div className="flex gap-3 p-6">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Break the fourth wall... what do you want to create?"
                  className="flex-1 bg-black border border-white/20 focus:border-amber-400 rounded-2xl px-7 py-5 text-lg outline-none"
                />
                <button 
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-amber-400 hover:bg-amber-300 disabled:bg-zinc-700 text-black px-14 rounded-2xl font-semibold flex items-center gap-2 transition-all"
                >
                  TRANSMIT <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="py-12 text-center text-xs text-white/30 font-mono border-t border-white/10">
          THIS IS NOT A LANDING PAGE.<br />THIS IS THE TRAILER. THE ANTI-HERO IS ALREADY INSIDE THE PORTAL.
        </div>
      </div>

      <style jsx global>{`
        @keyframes portalPulse {
          0%, 100% { box-shadow: 0 0 80px 40px rgb(103 232 249 / 0.6); }
          50% { box-shadow: 0 0 160px 90px rgb(165 243 252 / 0.9); }
        }
        .neon-text {
          text-shadow: 
            0 0 10px #fff,
            0 0 20px #fff,
            0 0 40px #f59e0b,
            0 0 80px #f59e0b;
        }
      `}</style>
    </div>
  );
}
