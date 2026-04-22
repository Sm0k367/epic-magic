'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, User, X, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const links = [
  { title: "EPIC TECH AI LOUNGE", url: "https://epic-tech-ai-lounge.vercel.app", category: "CORE HUB", emoji: "🌌" },
  { title: "AFTER DARK V", url: "https://after-dark-five.vercel.app", category: "CORE HUB", emoji: "🌃" },
  { title: "EPIC TECH .AI", url: "https://epictech.ai", category: "CORE HUB", emoji: "🚀" },
  { title: "DJ SMOKE STREAM", url: "https://suno.com/@dj_smoke_stream", category: "MUSIC VAULT", emoji: "🎵" },
  { title: "MUSIC VAULT ETA", url: "https://music-vault-eta.vercel.app", category: "MUSIC VAULT", emoji: "📼" },
  { title: "EPIC AI BOT", url: "https://epic-ai-bot.vercel.app", category: "AI AGENTS", emoji: "🤖" },
  { title: "100+ REPOS", url: "https://github.com/Sm0k367", category: "FULL REPOS", emoji: "🐙" },
  { title: "@Sm0ken42O", url: "https://x.com/Sm0ken42O", category: "THE ANTI-HERO", emoji: "𝕏" },
  { title: "@EPIC TECH AI", url: "https://youtube.com/@epictech-ai", category: "VIDEO VAULT", emoji: "📺" },
  { title: "@EpicTechAI", url: "https://websim.com/@EpicTechAI", category: "WEBSIM", emoji: "🌐" },
  { title: "SM0KEN42O SHOWCASE", url: "https://beta.pixio.myapps.ai/showcase/creator/sm0ken42o", category: "PIXIO", emoji: "🖼️" },
  { title: "SM0K367.GITHUB.IO", url: "https://sm0k367.github.io", category: "INTERACTIVE DEMOS", emoji: "🌐" },
];

export default function EpicMagicCinematic() {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [antiHeroOpen, setAntiHeroOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "The golden hour is calling. What reality shall we hack tonight, partner?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply || "The signal from the sprawl is weak tonight." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "The portal is turbulent tonight. The anti-hero will return shortly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans">
      {/* Cyberpunk Background */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(#1a1428_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-amber-500/10 via-transparent to-black" />

      {/* Top HUD */}
      <div className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-8 text-xs font-mono tracking-[3px] border-b border-white/10 bg-black/90 backdrop-blur-xl">
        <div>2077 • GOLDEN HOUR TRANSMISSION</div>
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setTrailerOpen(true)}
            className="flex items-center gap-2 hover:text-amber-400 transition-colors"
          >
            <Play className="w-4 h-4" /> PLAY TRAILER
          </button>
          <button 
            onClick={() => setPortalOpen(true)}
            className="px-8 py-1.5 bg-white text-black rounded-full font-medium hover:bg-amber-400 transition-all"
          >
            OPEN THE PORTAL
          </button>
        </div>
      </div>

      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        {/* DJ Smoke Stream */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6 }}
          className="mb-10 relative"
        >
          <div className="w-72 h-96 mx-auto relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900 to-black border-[14px] border-amber-400 rounded-3xl shadow-2xl overflow-hidden">
              <div className="absolute top-12 left-1/2 -translate-x-1/2 w-44 h-52 bg-gradient-to-b from-amber-100 to-amber-700 rounded-t-3xl border-8 border-black flex items-center justify-center">
                <div className="text-8xl scale-x-125 -mt-4">👁️</div>
              </div>
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-7xl">😏</div>
            </div>
            <div className="absolute -inset-12 bg-gradient-to-br from-amber-400/40 via-cyan-400/30 to-transparent blur-[90px] -z-10" />
          </div>
        </motion.div>

        <h1 className="text-[92px] md:text-[128px] leading-none font-black tracking-[-6px] bg-clip-text text-transparent bg-gradient-to-b from-white via-amber-100 to-amber-400 mb-4 neon-text">
          EPIC TECH AI
        </h1>

        <p className="text-2xl text-amber-100/80 max-w-md mx-auto mb-16 tracking-wide">
          The portal between the streets and the stars.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setTrailerOpen(true)}
            className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/30 hover:border-amber-400 px-12 py-6 rounded-3xl text-lg font-medium transition-all backdrop-blur-xl"
          >
            <Play className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
            PLAY TRAILER
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPortalOpen(true)}
            className="group flex items-center gap-4 bg-gradient-to-r from-cyan-400 to-amber-400 text-black px-14 py-6 rounded-3xl text-2xl font-bold tracking-tighter shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-400 transition-all"
          >
            ENTER THE PORTAL
            <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setAntiHeroOpen(true)}
            className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/30 hover:border-white px-12 py-6 rounded-3xl text-lg font-medium transition-all backdrop-blur-xl neon-text"
          >
            MEET THE ANTI-HERO
            <User className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Trailer Modal */}
      <AnimatePresence>
        {trailerOpen && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setTrailerOpen(false)}>
            <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
              <button onClick={() => setTrailerOpen(false)} className="absolute -top-12 right-0 text-white/70 hover:text-white flex items-center gap-2 text-sm">
                CLOSE <X size={18} />
              </button>
              <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                <video controls autoPlay className="w-full h-full" src="/image.mp4">
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="text-center text-xs text-white/40 mt-6 font-mono tracking-widest">
                THE FIRST 15 SECONDS OF A FILM THAT HASN'T BEEN MADE YET
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Portal Chat Modal */}
      <AnimatePresence>
        {portalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setPortalOpen(false)}>
            <div className="bg-zinc-950 border border-amber-400/30 w-full max-w-2xl rounded-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="bg-black p-6 border-b border-amber-400/20 flex items-center justify-between">
                <div>
                  <div className="text-amber-400 text-xs font-mono tracking-widest">STARGATE NODE ACTIVE</div>
                  <div className="text-2xl font-bold text-white">TALK TO THE ANTI-HERO</div>
                </div>
                <button onClick={() => setPortalOpen(false)} className="text-white/40 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div ref={chatContainerRef} className="h-96 p-6 overflow-y-auto space-y-6 bg-[#0a0a0f]">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                      msg.role === 'user' 
                        ? 'bg-amber-400 text-black' 
                        : 'bg-zinc-900 border border-cyan-400/30 text-white'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && <div className="text-amber-400 text-sm font-mono">The anti-hero is responding from the sprawl...</div>}
              </div>

              <div className="p-4 border-t border-white/10 bg-black">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Break the fourth wall... what do you want to create?"
                    className="flex-1 bg-zinc-900 border border-white/20 focus:border-amber-400 rounded-2xl px-6 py-4 text-white placeholder:text-white/40 outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="bg-amber-400 hover:bg-amber-300 disabled:bg-zinc-700 text-black px-8 rounded-2xl font-semibold flex items-center gap-2 transition-all"
                  >
                    TRANSMIT <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Anti-Hero Archive Modal */}
      <AnimatePresence>
        {antiHeroOpen && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6" onClick={() => setAntiHeroOpen(false)}>
            <div className="relative max-w-6xl w-full max-h-[90vh] bg-zinc-950 border border-amber-400/50 rounded-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-black p-6 border-b border-amber-400/30 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">😏</div>
                  <div>
                    <h2 className="text-4xl font-black tracking-tighter neon-text">THE ANTI-HERO ARCHIVE</h2>
                    <p className="text-amber-400 text-xs font-mono">100+ PROJECTS • THE FULL UNIVERSE</p>
                  </div>
                </div>
                <button 
                  onClick={() => setAntiHeroOpen(false)}
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white px-8 py-3 rounded-2xl text-sm font-medium transition-all"
                >
                  RETURN TO THE SPRAWL <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {links.map((link, index) => (
                    <a 
                      key={index}
                      href={link.url} 
                      target="_blank" 
                      className="group block bg-zinc-900 border border-amber-400/30 rounded-3xl overflow-hidden hover:border-amber-400 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-400/30"
                    >
                      <div className="h-40 bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center text-6xl">
                        {link.emoji}
                      </div>
                      <div className="p-5">
                        <div className="text-amber-400 text-xs font-mono">{link.category}</div>
                        <div className="font-bold text-lg leading-tight">{link.title}</div>
                      </div>
                    </a>
                  ))}
                </div>

                <div className="text-center text-xs text-white/30 font-mono tracking-widest mt-12">
                  WITHOUT YOU, NONE OF THESE SHIPS WOULD SAIL • THE ANTI-HERO THANKS YOU 🚀
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 h-11 bg-black/80 border-t border-white/10 flex items-center justify-center text-xs font-mono text-white/40 z-40 gap-8">
        <a href="/privacy" className="hover:text-amber-400 transition-colors">PRIVACY POLICY</a>
        <span>(c) 2077 SM0K3VERSE STUDIOS - THE ANTI-HERO IS WATCHING</span>
      </div>
    </div>
  );
}
