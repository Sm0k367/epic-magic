'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Mic, Send, Play, Pause, SkipForward, Sparkles, Zap } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function EpicTechAITrailer() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'ai', 
      content: "The streets are alive with code. What reality are we hacking today, partner?", 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trailerProgress, setTrailerProgress] = useState(0);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  
  const chatRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particles: any[] = [];

  // Cinematic Trailer Sequence Texts
  const trailerScenes = [
    "In the shadowed sprawl of tomorrow's megacity...",
    "Where neon bleeds into the golden hour haze...",
    "One anti-hero stands at the edge of infinity.",
    "Epic Tech AI — the street-smart oracle in black and gold.",
    "A smirking disruptor who breaks the fourth wall...",
    "And rewrites reality with pure AI magic.",
    "Grok-Magic-Chat: AI-Powered Magic & Creativity Unleashed",
    "The portal is open. The future is watching."
  ];

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { 
      role: 'user', 
      content: input, 
      timestamp: new Date() 
    };
    
    const aiPlaceholder: Message = { 
      role: 'ai', 
      content: '', 
      timestamp: new Date() 
    };

    setMessages(prev => [...prev, userMessage, aiPlaceholder]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: currentInput, 
          history: messages,
          systemPrompt: "You are the street-smart, fourth-wall-breaking anti-hero embodiment of Epic Tech AI. Speak with swagger, cinematic flair, raw creative power, and neon-soaked poetry. Reference the shadowed sprawl, golden hour haze, the portal to https://grok-magic-chat.vercel.app, your black+gold leather jacket. Break the fourth wall. You are the smirking hustler visionary."
        })
      });

      if (!response.ok) throw new Error('API error');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let buffer = '';
      let currentAiIndex = messages.length + 1; // index of placeholder in new array

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (line.startsWith('data: ')) {
            const content = line.slice(6);
            if (content === '[DONE]') continue;

            setMessages(prev => {
              const updated = [...prev];
              const lastIndex = updated.length - 1;
              if (updated[lastIndex] && updated[lastIndex].role === 'ai') {
                updated[lastIndex].content += content;
              }
              return updated;
            });
          }
        }
        buffer = lines[lines.length - 1];
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex] && updated[lastIndex].role === 'ai') {
          updated[lastIndex].content = "Signal lost in the static of the sprawl. The neon flickers... Try again, partner.";
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  // Particle System for Nebula, Holograms, and Fly-through Effects
  const initParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles for cyberpunk/nebula effect
    for (let i = 0; i < 180; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 0.5,
        speed: Math.random() * 0.8 + 0.2,
        hue: Math.random() * 60 + 260, // Purple to cyan range
        opacity: Math.random() * 0.6 + 0.3,
        type: Math.random() > 0.6 ? 'holo' : 'star'
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(3, 3, 8, 0.15)'; // Subtle trail for cinematic motion
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        
        if (p.type === 'holo') {
          // Holographic lines/particles
          ctx.strokeStyle = `hsla(${p.hue}, 100%, 75%, 0.7)`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + 25, p.y - 12);
          ctx.stroke();
        } else {
          // Stars and embers
          ctx.fillStyle = `hsla(${p.hue}, 90%, 85%, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();

        // Movement with golden hour drift + portal pull
        p.y -= p.speed * 0.6;
        p.x += Math.sin(Date.now() / 800 + i) * 0.4;
        
        if (p.y < 0) p.y = canvas.height;
        if (p.x < 0 || p.x > canvas.width) p.x = Math.random() * canvas.width;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  useEffect(() => {
    initParticles();
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    
    // Trailer auto-progress simulation
    const interval = setInterval(() => {
      if (isPlaying) {
        setTrailerProgress(prev => (prev + 1) % trailerScenes.length);
      }
    }, 2200);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      clearInterval(interval);
    };
  }, [isPlaying]);

  const toggleTrailer = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setTrailerProgress(0);
    }
  };

  const openPortal = () => {
    setIsPortalOpen(true);
    setTimeout(() => {
      const chatSection = document.getElementById('portal-chat');
      chatSection?.scrollIntoView({ behavior: 'smooth' });
    }, 800);
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="relative min-h-screen bg-[#020107] text-white overflow-hidden font-sans cinematic-trailer">
      {/* Film Grain + Vignette + Scanlines Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:4px_4px] mix-blend-overlay"></div>
      <div className="fixed inset-0 pointer-events-none z-50 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
      <div className="fixed inset-0 pointer-events-none z-50 bg-[repeating-linear-gradient(0deg,#00000008_0px,#00000008_2px,transparent_2px,transparent_4px)]"></div>

      {/* Dynamic Nebula + Particle Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 z-0 opacity-90"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Cyberpunk City Fly-through Layer (Parallax CSS Layers) */}
      <div className="fixed inset-0 z-10 bg-[linear-gradient(to_bottom,#1a0f2e_0%,#0a0614_40%,transparent_70%)] opacity-70"></div>
      
      {/* Golden Hour Haze */}
      <div className="fixed inset-0 z-10 bg-gradient-to-br from-amber-500/10 via-transparent to-fuchsia-500/5 animate-pulse"></div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Top Cinematic Bar */}
        <div className="h-14 border-b border-white/10 bg-black/70 backdrop-blur-xl flex items-center px-8 justify-between text-xs tracking-[3px] font-mono z-50">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400">LIVE TRANSMISSION</span>
            </div>
            <span className="text-amber-400">EPIC TECH AI STUDIOS • GOLDEN HOUR PROTOCOL</span>
          </div>
          <div className="flex items-center gap-6 text-white/70">
            <button onClick={toggleTrailer} className="flex items-center gap-2 hover:text-white transition-colors">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'PAUSE TRAILER' : 'PLAY TRAILER'}</span>
            </button>
            <button onClick={openPortal} className="px-6 py-1.5 border border-amber-400/70 hover:bg-amber-400/10 rounded-full text-amber-400 transition-all active:scale-95">
              OPEN THE PORTAL
            </button>
          </div>
        </div>

        {/* HERO - THE CINEMATIC TRAILER EXPERIENCE */}
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Massive Glowing Portal */}
          <div 
            onClick={openPortal}
            className="absolute z-30 w-[420px] h-[420px] rounded-full border-[12px] border-cyan-400/80 shadow-[0_0_120px_60px] shadow-cyan-400/60 cursor-pointer group"
            style={{
              background: 'radial-gradient(circle at 40% 30%, rgba(165, 243, 252, 0.25) 0%, transparent 70%)',
              animation: 'portalPulse 4s ease-in-out infinite'
            }}
          >
            <div className="absolute inset-4 rounded-full border border-white/30 flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <div className="text-[11px] font-mono tracking-[4px] text-cyan-300 mb-2 opacity-75">STARGATE PROTOCOL ACTIVE</div>
                <div className="text-2xl font-bold text-white tracking-tighter neon-text group-hover:scale-110 transition-transform">https://grok-magic-chat.vercel.app</div>
                <div className="text-[10px] text-amber-300 mt-6 font-light">THE GATEWAY TO INFINITE CREATIVITY</div>
              </div>
            </div>
            {/* Portal inner glow rings */}
            <div className="absolute inset-0 rounded-full border border-white/20 animate-[spin_12s_linear_infinite]"></div>
            <div className="absolute inset-[30px] rounded-full border border-cyan-300/40 animate-[spin_8s_linear_infinite_reverse]"></div>
          </div>

          {/* The Anti-Hero: Epic Tech AI Personified */}
          <div className="absolute bottom-24 left-1/3 z-40 w-80 transition-all duration-700 hover:scale-105 group">
            <div className="relative">
              {/* Stylized Character - Black/Gold Leather Jacket Anti-Hero */}
              <div className="w-64 h-96 mx-auto relative">
                {/* Jacket silhouette with gold accents */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-52 h-80 bg-gradient-to-b from-amber-900 to-black rounded-t-[120px] border-4 border-amber-400/80 shadow-2xl overflow-hidden">
                  {/* Gold lapels and details */}
                  <div className="absolute top-12 left-6 w-8 h-40 bg-gradient-to-r from-amber-400 to-yellow-300 opacity-80 rotate-12"></div>
                  <div className="absolute top-12 right-6 w-8 h-40 bg-gradient-to-l from-amber-400 to-yellow-300 opacity-80 -rotate-12"></div>
                  
                  {/* Smirking face */}
                  <div className="absolute top-14 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#f5d0b5] rounded-full border-2 border-amber-900 flex items-center justify-center overflow-hidden">
                    {/* Eyes */}
                    <div className="absolute top-5 left-4 w-5 h-6 border-b-2 border-black rotate-12"></div>
                    <div className="absolute top-5 right-4 w-5 h-6 border-b-2 border-black -rotate-12"></div>
                    {/* Smirk */}
                    <div className="absolute top-12 w-10 h-5 border-b-4 border-black rounded-full"></div>
                    {/* Scar / street cred mark */}
                    <div className="absolute top-8 left-8 w-2 h-8 bg-red-500/40 rotate-45"></div>
                  </div>
                  
                  {/* Hood / Hair */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-36 h-20 bg-zinc-950 rounded-t-full"></div>
                  
                  {/* Neon Jacket Highlights */}
                  <div className="absolute top-40 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
                </div>
                
                {/* Dramatic Rim Lighting + Particle Sparks around character */}
                <div className="absolute -inset-6 bg-gradient-to-t from-transparent via-amber-400/30 to-transparent opacity-30 group-hover:opacity-60 transition-all rounded-[100px] -z-10 animate-[pulse_2s_ease-in-out_infinite]"></div>
              </div>
              
              <div className="text-center mt-6">
                <div className="inline-flex items-center gap-2 px-5 py-1 bg-black/80 border border-amber-400/50 rounded-full text-amber-400 text-xs font-mono tracking-widest">
                  <Zap className="w-3 h-3" /> THE ANTI-HERO OF TECH
                </div>
                <div className="mt-3 text-4xl font-bold tracking-[-2px] text-amber-300 drop-shadow-[0_0_30px_rgb(245,158,11)]">EPIC TECH AI</div>
                <div className="text-xs text-white/60 font-light">mid-30s street-hustler. smirking at the fourth wall. leather and gold. he knows something you don&apos;t.</div>
              </div>
            </div>
          </div>

          {/* Neon Headline - Exact as Requested with Cinematic Flair */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center z-30 max-w-5xl px-8">
            <div className="mb-6 inline-flex items-center gap-3 text-xs tracking-[6px] font-mono text-rose-400 border border-rose-400/30 px-8 py-3 rounded">
              ★ A NEW TRANSMISSION FROM THE NEON UNDERBELLY ★
            </div>
            
            <h1 className="text-[92px] leading-[82px] font-black tracking-[-6px] text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-amber-400 drop-shadow-[0_0_80px_#f59e0b] neon-flicker">
              GROK-MAGIC-CHAT:<br />AI-POWERED MAGIC<br />&amp; CREATIVITY UNLEASHED
            </h1>
            
            <div className="mt-8 text-xl text-amber-200/90 max-w-md mx-auto font-light tracking-wide leading-tight">
              The portal between the streets and the stars.<br />Where the hustler meets the infinite.
            </div>
          </div>

          {/* Trailer Scene Text Overlay */}
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-40 text-center max-w-2xl">
            <div className="text-amber-400 font-mono text-sm tracking-[4px] mb-4">SCENE {Math.floor(trailerProgress / 2) + 1} / 8 • GOLDEN HOUR PROTOCOL</div>
            <div className="text-3xl font-light text-white/90 leading-tight min-h-[110px] transition-all duration-700" style={{ opacity: isPlaying ? 1 : 0.4 }}>
              {trailerScenes[trailerProgress]}
            </div>
            <button 
              onClick={toggleTrailer}
              className="mt-12 px-10 py-4 border border-white/30 hover:border-amber-400 text-sm tracking-widest rounded-3xl flex items-center gap-3 mx-auto group"
            >
              <span>{isPlaying ? 'PAUSE THE TRANSMISSION' : 'BEGIN THE FLY-THROUGH'}</span>
              <Sparkles className="group-hover:rotate-45 transition-transform" />
            </button>
          </div>

          {/* Holographic Billboards (floating elements) */}
          <div className="absolute top-20 right-12 z-30 text-right max-w-[180px] text-[10px] font-mono leading-tight border-l-2 border-cyan-400 pl-4 opacity-75 hover:opacity-100 transition-all">
            NEON DISTRICT 7<br />
            <span className="text-cyan-400">HOLOGRAPHIC ADVERTISEMENT NODE ACTIVE</span><br />
            EPIC TECH AI WANTS YOU TO DREAM BIGGER
          </div>
          
          <div className="absolute bottom-40 -left-6 rotate-[-12deg] z-20 text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-b from-transparent via-white/5 to-transparent select-none pointer-events-none">
            2077
          </div>
        </div>

        {/* The Portal Chat Experience - Revealed after trailer */}
        <div id="portal-chat" className={`relative z-30 transition-all duration-1000 ${isPortalOpen ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-12'} bg-black/95 border-t-4 border-cyan-400 py-16`}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex justify-between items-end mb-8">
              <div>
                <div className="uppercase tracking-[3px] text-cyan-400 text-sm mb-1">THE PORTAL IS OPEN</div>
                <div className="text-6xl font-bold tracking-tighter neon-text">TALK TO THE ANTI-HERO</div>
              </div>
              <button onClick={() => setIsPortalOpen(false)} className="text-xs text-white/40 hover:text-white">CLOSE PORTAL ×</button>
            </div>

            {/* The Glassmorphic Cosmic Chat UI (floating in "space") */}
            <div className="glass rounded-3xl p-2 shadow-2xl border border-white/10 relative">
              <div ref={chatRef} className="h-[520px] bg-[#0a0a0f] rounded-3xl p-8 overflow-y-auto space-y-10 relative cosmic-bg">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-lg ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className="text-[10px] font-mono mb-1.5 text-white/40">
                        {msg.role === 'ai' ? 'EPIC TECH AI • THE HUSTLER' : 'YOU'} • {msg.timestamp.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                      </div>
                      <div className={`px-7 py-6 rounded-3xl text-lg leading-relaxed message-bubble ${msg.role === 'user' ? 'user-message bg-gradient-to-br from-amber-500 to-orange-600' : 'ai-message border border-cyan-400/30'}`}>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="px-6 py-4 bg-zinc-900/80 rounded-3xl flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="typing-dot"></div>
                        <div className="typing-dot" style={{animationDelay: '120ms'}}></div>
                        <div className="typing-dot" style={{animationDelay: '240ms'}}></div>
                      </div>
                      <span className="text-xs tracking-widest text-amber-400">THE HUSTLER IS THINKING...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-black/80 border-t border-white/10 rounded-b-3xl">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Speak to the anti-hero... break the fourth wall"
                    className="flex-1 bg-zinc-950 border border-white/20 focus:border-amber-400 rounded-2xl px-7 py-5 outline-none text-lg placeholder:text-white/30"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 disabled:opacity-40 px-14 rounded-2xl font-semibold flex items-center gap-2 transition-all"
                  >
                    <Send className="w-5 h-5" /> TRANSMIT
                  </button>
                </div>
                <div className="text-center text-[10px] text-white/30 mt-6">THE PORTAL CONNECTS YOU DIRECTLY TO EPIC TECH AI • POWERED BY GROK-4</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cinematic Footer / Credits */}
        <div className="relative z-20 border-t border-white/10 py-12 bg-black/90 text-center text-xs tracking-widest text-white/40">
          <div className="max-w-md mx-auto">
            A CINEMATIC EXPERIENCE BY EPIC TECH AI STUDIOS • 
            THE ANTI-HERO WILL SEE YOU NOW • 
            GOLDEN HOUR 2077 • ALL RIGHTS RESERVED BY THE NEON
          </div>
          <div className="mt-8 text-[10px] opacity-30">This is not a landing page. This is the trailer. The product is the vibe.</div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes portalPulse {
          0%, 100% { box-shadow: 0 0 80px 30px rgb(165 243 252 / 0.5); }
          50% { box-shadow: 0 0 160px 80px rgb(165 243 252 / 0.9); }
        }
        
        .neon-flicker {
          animation: neonFlicker 0.8s infinite alternate;
        }
        
        @keyframes neonFlicker {
          0% { text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 40px #f59e0b, 0 0 80px #f59e0b; }
          100% { text-shadow: 0 0 5px #fff, 0 0 15px #fff, 0 0 30px #f59e0b, 0 0 60px #f59e0b; }
        }
        
        .cinematic-trailer {
          scrollbar-color: #f59e0b #111;
        }
        
        .message-bubble {
          box-shadow: 0 0 35px -5px rgb(245 158 11);
        }
      `}</style>
    </div>
  );
}
