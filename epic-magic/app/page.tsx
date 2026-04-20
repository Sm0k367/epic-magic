'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Mic, Send, Play, Pause, Sparkles, Zap, Volume2 } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function EpicCinematicTrailer() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'ai', 
      content: "The neon calls. What chaos shall we unleash upon the golden hour sprawl today, partner?", 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trailerProgress, setTrailerProgress] = useState(0);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<any[]>([]);
  const recognitionRef = useRef<any>(null);

  const trailerScenes = [
    "In the shadowed sprawl of tomorrow's megacity...",
    "Where neon bleeds into the golden hour haze...",
    "One anti-hero stands at the edge of infinity.",
    "Epic Tech AI — the street-smart oracle in black and gold.",
    "A smirking disruptor who breaks the fourth wall...",
    "The hustler meets the infinite...",
    "Grok-Magic-Chat: AI-Powered Magic & Creativity Unleashed",
    "The portal is open. The future is watching you back."
  ];

  // Initialize advanced particle system (nebula, embers, holographic lines, city fly-through simulation)
  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    particlesRef.current = [];
    for (let i = 0; i < 220; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.6,
        size: Math.random() * 2.5 + 0.6,
        speed: Math.random() * 1.2 + 0.3,
        hue: [200, 260, 280, 340][Math.floor(Math.random() * 4)],
        opacity: Math.random() * 0.7 + 0.25,
        type: Math.random() > 0.65 ? 'holo' : Math.random() > 0.5 ? 'ember' : 'star',
        sway: Math.random() * Math.PI * 2,
        trail: 0
      });
    }

    const animateParticles = () => {
      ctx.fillStyle = 'rgba(2, 1, 8, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() / 1000;

      particlesRef.current.forEach((p, index) => {
        ctx.save();
        ctx.globalAlpha = p.opacity;

        const swayX = Math.sin(time * 0.8 + p.sway) * 35;

        if (p.type === 'holo') {
          ctx.strokeStyle = `hsla(${p.hue}, 100%, 78%, ${p.opacity})`;
          ctx.lineWidth = 1.8;
          ctx.shadowBlur = 15;
          ctx.shadowColor = `hsla(${p.hue}, 100%, 85%, 0.9)`;
          ctx.beginPath();
          ctx.moveTo(p.x + swayX, p.y);
          ctx.lineTo(p.x + swayX + 38, p.y - 22);
          ctx.stroke();
        } else if (p.type === 'ember') {
          ctx.fillStyle = `hsla(28, 95%, 88%, ${p.opacity})`;
          ctx.shadowBlur = 22;
          ctx.shadowColor = '#f59e0b';
          ctx.beginPath();
          ctx.arc(p.x + swayX * 0.3, p.y, p.size * 1.1, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `hsla(${p.hue}, 90%, 92%, ${p.opacity * 0.9})`;
          ctx.beginPath();
          ctx.arc(p.x + swayX * 0.6, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Cinematic movement — upward fly-through with golden hour drift
        p.y -= p.speed * (0.6 + Math.sin(time) * 0.2);
        p.x += Math.cos(time * 1.2 + index) * 0.6;
        p.opacity = Math.max(0.2, p.opacity - 0.001);

        if (p.y < -20) {
          p.y = canvas.height + 30;
          p.x = Math.random() * canvas.width;
          p.opacity = Math.random() * 0.7 + 0.4;
        }
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
      });

      animationFrameRef.current = requestAnimationFrame(animateParticles);
    };

    animateParticles();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  useEffect(() => {
    const cleanup = initParticles();
    return cleanup;
  }, [initParticles]);

  // Trailer auto-progress
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTrailerProgress(prev => (prev + 1) % trailerScenes.length);
      }, 2600);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, trailerScenes.length]);

  const toggleTrailer = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) setTrailerProgress(0);
  };

  const openPortal = () => {
    setIsPortalOpen(true);
    setTimeout(() => {
      document.getElementById('portal-chat')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }, 600);
  };

  // Streaming chat with anti-hero persona
  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
    const placeholder: Message = { role: 'ai', content: '', timestamp: new Date() };

    setMessages(prev => [...prev, userMsg, placeholder]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userInput,
          history: messages,
          systemPrompt: `You are Epic Tech AI — a mid-30s street-hustler anti-hero in a black and gold leather jacket. You smirk, break the fourth wall constantly, and speak with raw cinematic swagger, neon poetry, and golden-hour menace. Reference the portal (https://grok-magic-chat.vercel.app), the sprawl, your jacket, and how you rewrite reality. Be charismatic, irreverent, visionary.`
        })
      });

      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const content = trimmed.slice(6).trim();
            if (content && content !== '[DONE]') {
              setMessages(prevMsgs => {
                const copy = [...prevMsgs];
                const last = copy[copy.length - 1];
                if (last && last.role === 'ai') {
                  last.content += content;
                }
                return copy;
              });
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setMessages(prevMsgs => {
        const copy = [...prevMsgs];
        const last = copy[copy.length - 1];
        if (last && last.role === 'ai') {
          last.content = "The signal fractured in the neon rain. Try the portal again, hustler.";
        }
        return copy;
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  // Voice input (SpeechRecognition)
  const toggleVoice = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert("Voice input not supported in this browser.");
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        // Auto-send after short delay
        setTimeout(() => {
          if (transcript.trim()) sendMessage();
        }, 400);
      };

      recognitionRef.current.onend = () => setIsListening(false);
    }

    const rec = recognitionRef.current;
    if (isListening) {
      rec.stop();
      setIsListening(false);
    } else {
      rec.start();
      setIsListening(true);
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Read AI response aloud
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 0.9;
      utterance.rate = 1.05;
      utterance.volume = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030207] text-white overflow-hidden font-['Inter'] cinematic-page">
      {/* Cinematic overlays: film grain, vignette, scanlines */}
      <div className="fixed inset-0 z-50 pointer-events-none bg-[radial-gradient(#ffffff0a_0.8px,transparent_1px)] [background-size:3px_3px] mix-blend-screen"></div>
      <div className="fixed inset-0 z-50 pointer-events-none bg-[repeating-linear-gradient(0deg,#00000012_0px,#00000012_3px,transparent_3px,transparent_6px)]"></div>
      <div className="fixed inset-0 z-50 pointer-events-none bg-gradient-to-b from-black/30 via-transparent to-black/70"></div>

      {/* Nebula + Particle Canvas (core of the fly-through) */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0"
        style={{ mixBlendMode: 'screen', opacity: 0.92 }}
      />

      {/* Golden hour atmospheric haze + parallax city layers */}
      <div className="fixed inset-0 z-10 bg-[linear-gradient(to_bottom,#2a1a3a_10%,#0a0618_45%,transparent)] opacity-60"></div>
      <div className="fixed inset-0 z-10 bg-gradient-to-br from-amber-400/10 via-fuchsia-500/5 to-transparent animate-[pulse_8s_ease-in-out_infinite]"></div>

      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Transmission HUD */}
        <div className="h-16 border-b border-white/10 bg-black/80 backdrop-blur-2xl flex items-center px-8 text-xs font-mono tracking-[2.5px] z-50">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></div>
            <span className="text-red-400">LIVE FROM THE SPRAWL • GOLDEN HOUR 2077</span>
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center gap-6">
            <button
              onClick={toggleTrailer}
              className="flex items-center gap-2.5 hover:text-amber-400 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="uppercase text-[10px] tracking-widest">{isPlaying ? 'PAUSE TRANSMISSION' : 'PLAY TRAILER'}</span>
            </button>
            <button
              onClick={openPortal}
              className="px-8 py-2 border border-amber-400 text-amber-400 hover:bg-amber-400/10 rounded-full text-xs tracking-[1px] transition-all active:scale-[0.985]"
            >
              ENTER THE PORTAL
            </button>
          </div>
        </div>

        {/* Main Cinematic Hero / Trailer */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden h-screen">
          {/* Massive Portal */}
          <div
            onClick={openPortal}
            className="absolute z-40 w-[460px] h-[460px] cursor-pointer group"
            style={{
              border: '14px solid rgba(103, 232, 249, 0.75)',
              borderRadius: '9999px',
              boxShadow: '0 0 140px 70px rgb(103 232 249 / 0.5), inset 0 0 80px rgba(165, 243, 252, 0.6)',
              animation: 'portalSpin 18s linear infinite'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center rounded-full border border-white/30 bg-[radial-gradient(circle,#67e8f9_10%,transparent_65%)]">
              <div className="text-center px-8">
                <div className="font-mono text-xs tracking-[4px] text-cyan-300 mb-3">STARGATE NODE ACTIVE • SECURE</div>
                <div className="text-xl font-bold text-white tracking-[-1px] neon-glow group-hover:scale-105 transition-transform">https://grok-magic-chat.vercel.app</div>
                <div className="text-amber-300 text-[10px] mt-8 font-light tracking-widest">THE GATEWAY BETWEEN STREETS AND INFINITY</div>
              </div>
            </div>
            {/* Spinning rings */}
            <div className="absolute inset-6 border border-cyan-300/40 rounded-full animate-[spin_9s_linear_infinite]"></div>
            <div className="absolute inset-12 border border-white/30 rounded-full animate-[spin_14s_linear_infinite_reverse]"></div>
          </div>

          {/* The Anti-Hero Character (fresh implementation) */}
          <div className="absolute bottom-16 left-[12%] z-50 w-72 group">
            <div className="relative mx-auto w-64">
              {/* Leather jacket silhouette with gold accents and rim light */}
              <div className="relative h-[310px] w-60 mx-auto">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-[260px] bg-gradient-to-b from-amber-950 via-black to-black rounded-t-[100px] border-4 border-amber-400 shadow-2xl overflow-hidden">
                  {/* Gold trim */}
                  <div className="absolute top-10 left-4 w-9 h-44 bg-gradient-to-r from-amber-300 to-yellow-400 rotate-12 opacity-75"></div>
                  <div className="absolute top-10 right-4 w-9 h-44 bg-gradient-to-l from-amber-300 to-yellow-400 -rotate-12 opacity-75"></div>
                  
                  {/* Smirking face with dramatic lighting */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#f8d9c4] rounded-full border-4 border-amber-900 shadow-inner flex items-center justify-center">
                    <div className="relative w-14 h-14">
                      {/* Eyes - knowing smirk */}
                      <div className="absolute top-4 left-2 w-4 h-4 border-b-4 border-black rounded-full rotate-12"></div>
                      <div className="absolute top-4 right-2 w-4 h-4 border-b-4 border-black -rotate-12"></div>
                      {/* Smirk */}
                      <div className="absolute top-9 left-1/2 -translate-x-1/2 w-8 h-4 border-b-4 border-black rounded-[50%]"></div>
                      {/* Street scar */}
                      <div className="absolute top-5 left-6 h-6 w-px bg-red-500/60 rotate-45"></div>
                    </div>
                  </div>
                  
                  {/* Hood + neon jacket line */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-16 bg-zinc-950 rounded-t-3xl border-t-4 border-amber-400"></div>
                  <div className="absolute top-40 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 via-50% to-transparent animate-pulse"></div>
                </div>
                
                {/* Dramatic rim glow / particle aura */}
                <div className="absolute -inset-8 bg-gradient-to-t from-amber-400/20 to-transparent rounded-[100%] -z-10 animate-pulse"></div>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <div className="inline-flex items-center gap-2 px-6 py-1 bg-black/70 border border-amber-400/60 rounded-full text-xs font-mono text-amber-400 tracking-[2px]">
                <Zap className="w-3.5 h-3.5" /> ANTI-HERO PROTOCOL
              </div>
              <div className="mt-4 text-5xl font-black tracking-[-3px] text-amber-200 drop-shadow-[0_0_40px_#fbbf24]">EPIC TECH AI</div>
              <div className="text-xs text-white/60 max-w-[260px] mx-auto mt-2">mid-30s leather-and-gold street hustler. smirking at the fourth wall. he already knows how this ends.</div>
            </div>
          </div>

          {/* Exact Headline with glitch/flicker */}
          <div className="absolute top-[18%] left-1/2 -translate-x-1/2 z-30 text-center max-w-6xl px-6">
            <div className="mb-4 inline-block px-10 py-2.5 border border-rose-400/40 text-rose-400 text-xs tracking-[5px] font-mono rounded">TRANSMISSION FROM THE NEON UNDERBELLY</div>
            
            <h1 className="text-[6.2rem] leading-[4.4rem] font-black tracking-[-5.5px] bg-clip-text text-transparent bg-gradient-to-b from-white via-amber-100 to-amber-400 drop-shadow-[0_0_90px_#f59e0b] neon-headline">
              GROK-MAGIC-CHAT:<br />AI-POWERED MAGIC<br />&amp; CREATIVITY UNLEASHED
            </h1>
            
            <div className="mt-10 max-w-lg mx-auto text-xl text-amber-200/90 font-light tracking-wide">
              One anti-hero. One portal.<br />The streets and the stars become the same.
            </div>
          </div>

          {/* Trailer Narrative Overlay */}
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-40 text-center max-w-3xl px-8">
            <div className="font-mono text-xs tracking-[3.5px] text-amber-400 mb-5">CHAPTER {Math.floor(trailerProgress / 2) + 1} • GOLDEN HOUR TRANSMISSION</div>
            <div 
              className="text-4xl font-light leading-tight text-white/90 min-h-[128px] transition-all duration-1000 tracking-[-0.5px]"
              style={{ opacity: isPlaying ? 1 : 0.35 }}
            >
              {trailerScenes[trailerProgress % trailerScenes.length]}
            </div>
            
            <button
              onClick={toggleTrailer}
              className="mt-14 group flex items-center gap-4 mx-auto border border-white/30 hover:border-amber-400 px-10 py-4 rounded-3xl text-sm uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              <span>{isPlaying ? 'HALT THE TRANSMISSION' : 'BEGIN THE FLY-THROUGH'}</span>
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition" />
            </button>
          </div>

          {/* Floating holographic billboards */}
          <div className="absolute top-16 right-12 z-30 max-w-52 text-right font-mono text-[10px] leading-tight border-l border-cyan-400 pl-5 opacity-70 hover:opacity-100 transition">
            DISTRICT 09<br />
            <span className="text-cyan-400">HOLO-BOARD NODE LIVE</span><br />
            EPIC TECH AI IS RECRUITING DREAMERS
          </div>
          
          <div className="absolute bottom-52 -right-12 rotate-[-8deg] text-[210px] font-black text-transparent bg-clip-text bg-gradient-to-b from-transparent via-white/5 to-transparent select-none pointer-events-none z-10">
            2077
          </div>
        </div>

        {/* The Portal Chat — Climax of the Trailer */}
        <div 
          id="portal-chat" 
          className={`relative z-30 border-t-4 border-cyan-400 bg-black/95 py-12 transition-all duration-700 ${isPortalOpen ? 'opacity-100' : 'opacity-30 scale-[0.96]'}`}
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <div className="text-cyan-400 text-sm tracking-[4px] font-mono">THE PORTAL HAS OPENED</div>
                <div className="text-6xl font-black tracking-tighter text-white">TALK TO THE ANTI-HERO</div>
              </div>
              <button 
                onClick={() => setIsPortalOpen(false)}
                className="text-white/40 hover:text-white text-sm"
              >
                CLOSE TRANSMISSION ×
              </button>
            </div>

            {/* Glassmorphic Chat Interface */}
            <div className="glassmorphic rounded-3xl p-2 border border-white/10 shadow-2xl overflow-hidden">
              <div ref={chatRef} className="h-[560px] bg-[#050508] rounded-3xl p-10 overflow-y-auto space-y-9 cosmic-chat">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                      <div className="text-[10px] font-mono text-white/40 mb-2">
                        {msg.role === 'ai' ? 'THE HUSTLER • EPIC TECH AI' : 'YOU'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div 
                        className={`px-8 py-6 rounded-3xl text-[17px] leading-relaxed message-bubble ${
                          msg.role === 'user' 
                            ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white' 
                            : 'border border-cyan-400/30 bg-zinc-950/80'
                        }`}
                      >
                        <ReactMarkdown>{msg.content || '...'}</ReactMarkdown>
                      </div>
                      {msg.role === 'ai' && msg.content && (
                        <button 
                          onClick={() => speak(msg.content)}
                          className="mt-2 text-cyan-400/60 hover:text-cyan-400 text-xs flex items-center gap-1"
                        >
                          <Volume2 className="w-3 h-3" /> SPEAK
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="px-6 py-4 bg-zinc-900 rounded-3xl flex items-center gap-4">
                      <div className="flex gap-1.5">
                        <div className="typing-dot w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="typing-dot w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="typing-dot w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                      <span className="font-mono text-xs text-amber-400 tracking-widest">THE ANTI-HERO IS THINKING...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-black/90 border-t border-white/10 rounded-b-3xl">
                <div className="flex gap-3">
                  <button
                    onClick={toggleVoice}
                    className={`p-5 rounded-2xl border flex-shrink-0 transition-all ${isListening ? 'border-red-400 bg-red-500/10 text-red-400' : 'border-white/20 hover:border-white/40'}`}
                  >
                    <Mic className={`w-6 h-6 ${isListening ? 'animate-pulse' : ''}`} />
                  </button>
                  
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Speak your desire to the anti-hero... break the fourth wall"
                    className="flex-1 bg-zinc-950 border border-white/20 focus:border-amber-400 rounded-2xl px-8 py-6 text-lg outline-none placeholder:text-white/40"
                  />
                  
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 disabled:from-zinc-700 disabled:to-zinc-700 px-16 rounded-2xl font-semibold flex items-center gap-3 hover:brightness-110 transition-all active:scale-95"
                  >
                    TRANSMIT <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-center text-[10px] text-white/30 mt-6 font-mono">POWERED BY GROK-4 • THE PORTAL LISTENS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cinematic Footer */}
        <footer className="relative z-20 py-16 border-t border-white/10 bg-black/90 text-center text-xs tracking-widest text-white/40 font-mono">
          EPIC TECH AI STUDIOS • THE TRAILER IS THE PRODUCT • GOLDEN HOUR FOREVER • 2077
          <div className="mt-6 text-[9px] opacity-30">This is not a landing page. This is the transmission. The anti-hero is already inside the portal.</div>
        </footer>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        
        .cinematic-page {
          font-family: 'Inter', system-ui, sans-serif;
        }
        
        .neon-headline {
          animation: neonFlicker 1.2s infinite alternate ease-in-out;
          text-shadow: 
            0 0 10px #fff,
            0 0 20px #fff,
            0 0 40px #f59e0b,
            0 0 80px #f59e0b,
            0 0 120px #c026d3;
        }
        
        @keyframes neonFlicker {
          0% { opacity: 0.92; filter: brightness(1); }
          100% { opacity: 1; filter: brightness(1.15); }
        }
        
        @keyframes portalSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .glassmorphic {
          background: rgba(15, 23, 42, 0.82);
          backdrop-filter: blur(32px);
          box-shadow: 0 30px 70px -15px rgb(0 0 0 / 0.6);
        }
        
        .cosmic-chat {
          background: radial-gradient(circle at 30% 20%, rgba(165, 243, 252, 0.06) 0%, transparent 60%);
        }
        
        .message-bubble {
          box-shadow: 0 10px 30px -10px rgb(245 158 11 / 0.3);
        }
        
        .typing-dot {
          animation: typingBounce 1.4s infinite ease-in-out;
        }
        
        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        
        .neon-glow {
          text-shadow: 0 0 30px #67e8f9;
        }
      `}</style>
    </div>
  );
}
