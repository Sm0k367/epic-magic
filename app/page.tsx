'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, User, X, Send, ChevronLeft, ChevronRight } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const links = [
  { title: "Sanity Visual Editing Demo", url: "https://sanity-visual-editing-demo-ashy.vercel.app", category: "CORE HUB", emoji: "🧠" },
  { title: "Epic Magic", url: "https://epic-magic.vercel.app", category: "CORE HUB", emoji: "🌌" },
  { title: "Grok Magic Chat", url: "https://grok-magic-chat.vercel.app", category: "CORE HUB", emoji: "🤖" },
  { title: "Midnight Ritual", url: "https://midnight-ritual.vercel.app", category: "LOUNGE", emoji: "🌙" },
  { title: "Epic Tech .AI", url: "https://epictech.ai", category: "CORE HUB", emoji: "🚀" },
  { title: "Epictech Website", url: "https://epictech-website.vercel.app", category: "CORE HUB", emoji: "🌐" },
  { title: "Machine Built", url: "https://machine-built.vercel.app", category: "CORE HUB", emoji: "🛠️" },
  { title: "Music Vault ETA", url: "https://music-vault-eta.vercel.app", category: "MUSIC VAULT", emoji: "📼" },
  { title: "DJ Smoke Stream", url: "https://suno.com/@dj_smoke_stream", category: "MUSIC VAULT", emoji: "🎵" },
  { title: "Suno Liked Playlist", url: "https://suno.com/playlist/liked", category: "MUSIC VAULT", emoji: "❤️" },
  { title: "Epic AI Bot", url: "https://epic-ai-bot.vercel.app", category: "AI AGENTS", emoji: "🤖" },
  { title: "Pixio", url: "https://pixio.myapps.ai", category: "AI AGENTS", emoji: "🖼️" },
  { title: "Machine Claw", url: "https://machineclaw.myapps.ai", category: "AI AGENTS", emoji: "🦀" },
  { title: "Tunebot AI", url: "https://tunebot-ai.vercel.app", category: "AI AGENTS", emoji: "🎵" },
  { title: "Aigent", url: "https://aigent-zrxo.vercel.app", category: "AI AGENTS", emoji: "🧬" },
  { title: "Prompt Studio Tau", url: "https://promptstudio-tau.vercel.app", category: "AI AGENTS", emoji: "✍️" },
  { title: "Epic Help", url: "https://epic-help.vercel.app", category: "AI AGENTS", emoji: "🆘" },
  { title: "Intercom Bay", url: "https://intercom-bay.vercel.app", category: "AI AGENTS", emoji: "📢" },
  { title: "Neural Lounge", url: "https://sm0k367.github.io/neural-lounge/", category: "WEBGL DEMOS", emoji: "🧠" },
  { title: "Lyric Visualizer v2.0", url: "https://sm0k367.github.io/lyric-visualizer-v2.0/", category: "WEBGL DEMOS", emoji: "🎶" },
  { title: "Vault", url: "https://sm0k367.github.io/vault/", category: "WEBGL DEMOS", emoji: "🔒" },
  { title: "Game", url: "https://sm0k367.github.io/game/", category: "WEBGL DEMOS", emoji: "🎮" },
  { title: "High Stakes", url: "https://sm0k367.github.io/high-stakes/", category: "WEBGL DEMOS", emoji: "🎲" },
  { title: "Vids", url: "https://sm0k367.github.io/vids/", category: "WEBGL DEMOS", emoji: "📹" },
  { title: "Crablist", url: "https://sm0k367.github.io/crablist/", category: "WEBGL DEMOS", emoji: "🦀" },
  { title: "Nexus", url: "https://sm0k367.github.io/nexus/", category: "WEBGL DEMOS", emoji: "🔗" },
  { title: "Garden Chat", url: "https://sm0k367.github.io/gardenchat/", category: "WEBGL DEMOS", emoji: "🌿" },
  { title: "Epic Machine", url: "https://sm0k367.github.io/epicmachine/", category: "WEBGL DEMOS", emoji: "⚙️" },
  { title: "Referal", url: "https://sm0k367.github.io/referal/", category: "WEBGL DEMOS", emoji: "🔄" },
  { title: "Smoke Stream", url: "https://sm0k367.github.io/smoke-stream/", category: "WEBGL DEMOS", emoji: "🌫️" },
  { title: "Digital Epic Tech Visualizer", url: "https://aibutcher.tsiprogram.org/aitech/index.html", category: "WEBGL DEMOS", emoji: "📊" },
  { title: "Gateway Alpha", url: "https://gateway-alpha-dusky.vercel.app", category: "PORTALS", emoji: "🚪" },
  { title: "Gate Nine", url: "https://gate-nine-cyan.vercel.app", category: "PORTALS", emoji: "🚪" },
  { title: "Gate Keeper", url: "https://gate-keeper-rouge.vercel.app", category: "PORTALS", emoji: "🚪" },
  { title: "Portals V2", url: "https://portals-v2.vercel.app", category: "PORTALS", emoji: "🚪" },
  { title: "Portal Three Ochre", url: "https://portal-three-ochre.vercel.app", category: "PORTALS", emoji: "🚪" },
  { title: "Remote Delta", url: "https://remote-delta.vercel.app", category: "REMOTE", emoji: "📡" },
  { title: "Remote Rescue", url: "https://remote-rescue.vercel.app", category: "REMOTE", emoji: "🚁" },
  { title: "Remote Z996", url: "https://remote-z996.vercel.app", category: "REMOTE", emoji: "📡" },
  { title: "Storybook of Portals", url: "https://storybook-of-portals.vercel.app", category: "PORTALS", emoji: "📖" },
  { title: "Player", url: "https://player-dun.vercel.app", category: "EXPERIMENT", emoji: "🎮" },
  { title: "G-Cloud", url: "https://g-cloud.vercel.app", category: "EXPERIMENT", emoji: "☁️" },
  { title: "Stream Psi", url: "https://stream-psi-three.vercel.app", category: "EXPERIMENT", emoji: "🌊" },
  { title: "DJ Smoke Stream", url: "https://dj-smoke-stream.vercel.app", category: "EXPERIMENT", emoji: "🎤" },
  { title: "Epictech Tau", url: "https://epictech-tau.vercel.app", category: "EXPERIMENT", emoji: "🚀" },
  { title: "AI Lounge After Dark V2", url: "https://ai-lounge-after-dark-v2-behv.vercel.app", category: "LOUNGE", emoji: "🌃" },
  { title: "Epictech V1", url: "https://epictech-v1.vercel.app", category: "EXPERIMENT", emoji: "🛠️" },
  { title: "Epictech Army", url: "https://epictech-army.vercel.app", category: "COMMUNITY", emoji: "🛡️" },
  { title: "Epic Tech AI Digital Backpack V2", url: "https://epic-tech-ai-digital-backpack-v2.vercel.app", category: "TOOLS", emoji: "🎒" },
  { title: "Pixal Tale V1", url: "https://pixal-talev1.vercel.app", category: "STORY", emoji: "📖" },
  { title: "WTF", url: "https://wtf-drab.vercel.app", category: "EXPERIMENT", emoji: "❓" },
  { title: "Homeowner 1", url: "https://homeowner1-beryl.vercel.app", category: "EXPERIMENT", emoji: "🏠" },
  { title: "Trading Ecosystem", url: "https://trading-ecosystem.vercel.app", category: "TOOLS", emoji: "📈" },
  { title: "Smoke Stream", url: "https://smoke-stream.vercel.app", category: "MUSIC", emoji: "🌫️" },
  { title: "Avatar", url: "https://avatar-tbzs.vercel.app", category: "AVATAR", emoji: "👤" },
  { title: "AI Lounge After Dark", url: "https://ai-lounge-after-dark.vercel.app", category: "LOUNGE", emoji: "🌃" },
  { title: "OH Zeta", url: "https://oh-zeta.vercel.app", category: "EXPERIMENT", emoji: "🔮" },
  { title: "Website Eight Beige", url: "https://website-eight-beige-18.vercel.app", category: "SITE", emoji: "🌐" },
  { title: "Epictech Site", url: "https://epictech-site.vercel.app", category: "SITE", emoji: "🌐" },
  { title: "A1 WUSD", url: "https://a1-wusd.vercel.app", category: "EXPERIMENT", emoji: "💰" },
  { title: "Site Sigma Ashy", url: "https://site-sigma-ashy.vercel.app", category: "SITE", emoji: "🌐" },
  { title: "Epic Tech AI Landing", url: "https://epic-tech-ai-landing.vercel.app", category: "LANDING", emoji: "🏠" },
  { title: "Lyric Visualizer V2.0", url: "https://lyric-visualizer-v2-0.vercel.app", category: "VISUALIZER", emoji: "🎶" },
  { title: "Landing JCE5", url: "https://landing-jce5.vercel.app", category: "LANDING", emoji: "🏠" },
  { title: "Anarrative", url: "https://anarrative.vercel.app", category: "STORY", emoji: "📖" },
  { title: "Awake Virid", url: "https://awake-virid.vercel.app", category: "EXPERIMENT", emoji: "🌿" },
  { title: "Narrative Psi", url: "https://narrative-psi.vercel.app", category: "STORY", emoji: "📖" },
  { title: "Sm0k367 AI NextJS Chat", url: "https://sm0k367ai-nextjs-chat-cyan.vercel.app", category: "CHAT", emoji: "💬" },
];

const testimonials = [
  { quote: "Holy shit this is the best site I've ever seen.", author: "Client from the Sprawl" },
  { quote: "The anti-hero delivered in 9 days what my agency couldn't in 3 months.", author: "Another Legend" },
  { quote: "This isn't a website. This is a transmission from 2077.", author: "The Sprawl" },
  { quote: "I've never seen anyone build like this. It's another dimension.", author: "Portal Visitor" },
  { quote: "Hired for a landing page, got a cinematic universe. 10/10.", author: "Tech Founder" },
  { quote: "The anti-hero is the only dev who understood my vision completely.", author: "Creative Director" },
];

const playlist = [
  { title: "Epic Cinematic Experience", src: "/epic.mp4" },
  { title: "Anti-Hero Cinematic", src: "/antihero.mp4" },
  { title: "Your Uploaded Video", src: "/image.mp4" },
  { title: "420 Luxury Phonk Experience", src: "https://sm0ken42o-420-luxury-phonk-experience--epictechai.on.websim.com/" },
];

export default function EpicMagicCinematic() {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [portalOpen, setPortalOpen] = useState(false);
  const [antiHeroOpen, setAntiHeroOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: "The golden hour is calling. What reality shall we hack tonight, partner?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [carouselIndex, setCarouselIndex] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 35,
      y: (e.clientY / window.innerHeight - 0.5) * 25,
    });
  };

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
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: "The portal is turbulent tonight. The anti-hero will return shortly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const carouselPerPage = 6;
  const totalPages = Math.ceil(links.length / carouselPerPage);
  const visibleLinks = links.slice(carouselIndex * carouselPerPage, (carouselIndex + 1) * carouselPerPage);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans" onMouseMove={handleMouseMove}>
      {/* Cyberpunk Background */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(#1a1428_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-amber-500/10 via-transparent to-black" />

      {/* Top HUD */}
      <div className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-8 text-xs font-mono tracking-[3px] border-b border-white/10 bg-black/90 backdrop-blur-xl">
        <div>2077 • GOLDEN HOUR TRANSMISSION</div>
        <div className="flex items-center gap-8">
          <button
            onClick={() => { setCurrentVideoIndex(0); setTrailerOpen(true); }}
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

      {/* Hero Section */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-6 text-center pt-14 pb-24">
        {/* DJ Smoke Stream Anti-Hero Image - NO OVERLAY */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6 }}
          className="mb-10 relative"
          style={{ transform: `perspective(1000px) rotateX(${mousePos.y * -8}deg) rotateY(${mousePos.x * 12}deg)` }}
        >
          <div className="w-80 h-[420px] mx-auto relative">
            <img
              src="/dj-smoke-stream.jpg"
              alt="DJ Smoke Stream - The Anti-Hero"
              className="w-full h-full object-cover rounded-3xl border-[14px] border-amber-400 shadow-2xl"
            />
            <div className="absolute -inset-8 bg-gradient-to-br from-amber-400/40 via-cyan-400/30 to-transparent blur-[100px] -z-10" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-[72px] md:text-[108px] leading-none font-black tracking-[-6px] bg-clip-text text-transparent bg-gradient-to-b from-white via-amber-100 to-amber-400 mb-2 neon-text"
        >
          EPIC TECH AI • The Portal
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-xl md:text-2xl text-cyan-300 tracking-wide font-light mb-4 neon-text"
        >
          I build cinematic AI-powered web experiences that make people say &ldquo;holy shit&rdquo;.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-2xl text-amber-100/80 max-w-md mx-auto mb-12 tracking-wide"
        >
          The portal between the streets and the stars.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 flex-wrap justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => { setCurrentVideoIndex(0); setTrailerOpen(true); }}
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
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = "mailto:epictechai@gmail.com?subject=Hire%20The%20Anti-Hero%20-%20Project%20from%202077"}
            className="group relative px-10 py-6 text-xl font-bold tracking-widest border-2 border-pink-500 text-pink-400 shadow-[0_0_20px_#ff00aa,0_0_40px_#ff00aa,0_0_60px_#ff00aa] hover:bg-pink-500 hover:text-black hover:border-pink-500 transition-all duration-300 rounded-xl flex items-center gap-3"
          >
            <span className="absolute inset-0 bg-pink-500/20 animate-pulse rounded-xl" />
            HIRE THE ANTI-HERO
            <span className="text-2xl group-hover:rotate-45 transition-transform">⚡</span>
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
        </motion.div>
      </div>

      {/* Trailer Playlist Modal */}
      <AnimatePresence>
        {trailerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setTrailerOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setTrailerOpen(false)} className="absolute -top-12 right-0 text-white/70 hover:text-white flex items-center gap-2 text-sm">
                CLOSE <X size={18} />
              </button>

              <div className="bg-zinc-950 border border-amber-400/30 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <div className="font-mono text-amber-400 text-sm tracking-widest">TRAILER PLAYLIST • CURATED BY THE ANTI-HERO</div>
                  <div className="text-xs text-white/40">{currentVideoIndex + 1} / {playlist.length}</div>
                </div>

                <div className="aspect-video bg-black">
                  {playlist[currentVideoIndex].src.startsWith('http') ? (
                    <iframe
                      src={playlist[currentVideoIndex].src}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      key={playlist[currentVideoIndex].src}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full"
                      src={playlist[currentVideoIndex].src}
                    />
                  )}
                </div>

                {/* Playlist tabs */}
                <div className="px-6 pt-4 flex gap-2 overflow-x-auto">
                  {playlist.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentVideoIndex(i)}
                      className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                        i === currentVideoIndex
                          ? 'bg-amber-400 text-black'
                          : 'bg-zinc-900 text-white/60 hover:bg-zinc-800'
                      }`}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>

                <div className="p-6 flex gap-4">
                  <button
                    onClick={() => setCurrentVideoIndex((currentVideoIndex - 1 + playlist.length) % playlist.length)}
                    className="flex-1 py-3 border border-white/30 rounded-2xl hover:bg-white/5 transition flex items-center justify-center gap-2"
                  >
                    <ChevronLeft size={16} /> PREVIOUS
                  </button>
                  <button
                    onClick={() => setCurrentVideoIndex((currentVideoIndex + 1) % playlist.length)}
                    className="flex-1 py-3 bg-amber-400 text-black rounded-2xl font-bold hover:bg-amber-300 transition flex items-center justify-center gap-2"
                  >
                    NEXT VIDEO <ChevronRight size={16} />
                  </button>
                </div>

                <div className="px-6 pb-6 text-center text-xs text-white/50 font-mono">
                  NOW PLAYING: {playlist[currentVideoIndex].title}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portal Chat Modal - Chat with Grok 4 */}
      <AnimatePresence>
        {portalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setPortalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              className="bg-zinc-950 border border-amber-400/30 w-full max-w-2xl rounded-3xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-black p-6 border-b border-amber-400/20 flex items-center justify-between">
                <div>
                  <div className="text-amber-400 text-xs font-mono tracking-widest">GROK 4 • STARGATE NODE ACTIVE</div>
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
                      {msg.role === 'ai' && (
                        <div className="text-cyan-400 text-xs font-mono mb-1">GROK 4 • ANTI-HERO AI</div>
                      )}
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-900 border border-cyan-400/30 rounded-2xl px-6 py-4">
                      <div className="text-amber-400 text-sm font-mono flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-amber-400 rounded-full animate-bounce" />
                        <span className="inline-block w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <span className="inline-block w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        transmitting from the sprawl...
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/10 bg-black">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Break the fourth wall... what do you want to create?"
                    className="flex-1 bg-zinc-900 border border-white/20 focus:border-amber-400 rounded-2xl px-6 py-4 text-white placeholder:text-white/40 outline-none transition-colors"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className="bg-amber-400 hover:bg-amber-300 disabled:bg-zinc-700 text-black px-8 rounded-2xl font-semibold flex items-center gap-2 transition-all"
                  >
                    TRANSMIT <Send size={18} />
                  </button>
                </div>
                <div className="text-center text-xs text-white/30 font-mono mt-2">Powered by Grok 4 via xAI API</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Anti-Hero Archive Modal */}
      <AnimatePresence>
        {antiHeroOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6"
            onClick={() => setAntiHeroOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="relative max-w-6xl w-full max-h-[90vh] bg-zinc-950 border border-amber-400/50 rounded-3xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-black p-6 border-b border-amber-400/30 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  <img 
                    src="/dj-smoke-stream.jpg" 
                    alt="DJ Smoke Stream"
                    className="w-16 h-16 object-top rounded-2xl border-2 border-amber-400 shadow-lg"
                  />
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

                {/* Anti-Hero Image - No overlay */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="mb-12 relative rounded-3xl overflow-hidden border border-amber-400/50"
                >
                  <video
                    src="/antihero.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="text-amber-400 text-xs font-mono tracking-widest">THE ANTI-HERO • DJ SMOKE STREAM</div>
                    <div className="text-2xl font-black">Living in 2077. Building for the future.</div>
                  </div>
                </motion.div>

                {/* Rate Card */}
                <div className="mb-12 p-8 bg-zinc-900 border border-amber-400/50 rounded-3xl">
                  <div className="text-amber-400 text-xs font-mono tracking-widest mb-4">RATE CARD — TRANSMISSIONS FROM THE ANTI-HERO</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                      whileHover={{ scale: 1.02, borderColor: 'rgba(251,191,36,0.8)' }}
                      className="p-6 border border-amber-400/30 rounded-2xl transition-all"
                    >
                      <div className="text-cyan-300 text-sm">CINEMATIC LANDING PAGE</div>
                      <div className="text-4xl font-black text-white mt-2">$8k – $25k</div>
                      <div className="text-white/60 text-sm mt-4">Full trailer-style site with video, 3D, particles, and anti-hero vibe. 2-4 week delivery.</div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-6 border border-amber-400/30 rounded-2xl bg-amber-400/10 transition-all"
                    >
                      <div className="text-cyan-300 text-sm">FULL AI AGENT EXPERIENCE</div>
                      <div className="text-4xl font-black text-white mt-2">$15k – $50k</div>
                      <div className="text-white/60 text-sm mt-4">Custom Grok-powered agent, chat portal, 3D interface, and backend. The full transmission.</div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-6 border border-amber-400/30 rounded-2xl transition-all"
                    >
                      <div className="text-cyan-300 text-sm">MONTHLY RETAINER</div>
                      <div className="text-4xl font-black text-white mt-2">$4k/mo</div>
                      <div className="text-white/60 text-sm mt-4">Ongoing transmissions, new features, maintenance, and new portals every month.</div>
                    </motion.div>
                  </div>
                </div>

                {/* Testimonial Marquee */}
                <div className="mb-12 overflow-hidden border border-white/10 rounded-3xl bg-zinc-950 py-6">
                  <div className="text-white/30 text-xs font-mono tracking-widest text-center mb-4">TRANSMISSIONS FROM THE CLIENTS</div>
                  <div className="flex gap-8 animate-marquee whitespace-nowrap">
                    {[...testimonials, ...testimonials].map((t, i) => (
                      <div key={i} className="inline-flex items-center gap-6 bg-zinc-900 border border-cyan-400/30 px-8 py-4 rounded-2xl flex-shrink-0">
                        <div className="text-cyan-400 text-3xl">&ldquo;</div>
                        <div>
                          <div className="font-medium">&ldquo;{t.quote}&rdquo;</div>
                          <div className="text-xs text-white/50 mt-1">— {t.author}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking Form */}
                <div className="mb-12 p-8 bg-zinc-900 border border-pink-400/30 rounded-3xl">
                  <div className="text-pink-400 text-xs font-mono tracking-widest mb-6">BOOK A TRANSMISSION WITH THE ANTI-HERO</div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      window.location.href = 'mailto:epictechai@gmail.com?subject=Hire%20The%20Anti-Hero%20-%20New%20Transmission';
                    }}
                    className="space-y-6"
                  >
                    <input type="text" placeholder="Your Name" className="w-full bg-black border border-white/20 focus:border-pink-400 rounded-2xl px-6 py-4 text-white outline-none transition-colors" required />
                    <input type="email" placeholder="your@email.com" className="w-full bg-black border border-white/20 focus:border-pink-400 rounded-2xl px-6 py-4 text-white outline-none transition-colors" required />
                    <select className="w-full bg-black border border-white/20 rounded-2xl px-6 py-4 text-white outline-none">
                      <option>Cinematic Landing Page ($8k–$25k)</option>
                      <option>Full AI Agent Experience ($15k–$50k)</option>
                      <option>Monthly Retainer ($4k/mo)</option>
                      <option>Other Transmission</option>
                    </select>
                    <textarea placeholder="Describe your project from 2077..." className="w-full bg-black border border-white/20 focus:border-pink-400 rounded-2xl px-6 py-4 text-white h-32 outline-none transition-colors resize-none" required></textarea>
                    <button type="submit" className="w-full bg-pink-500 hover:bg-pink-400 text-black py-4 rounded-2xl font-bold tracking-widest transition-all shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:shadow-[0_0_40px_rgba(236,72,153,0.8)]">
                      SEND TRANSMISSION TO THE ANTI-HERO ⚡
                    </button>
                  </form>
                </div>

                {/* Wild Carousel - All Links with Effects */}
                <div className="mb-8">
                  <div className="text-amber-400 text-xs font-mono tracking-widest mb-4 flex items-center justify-between">
                    <span>THE UNIVERSE • {links.length} PORTALS</span>
                    <span className="text-white/30">Page {carouselIndex + 1} of {totalPages}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <AnimatePresence mode="wait">
                      {visibleLinks.map((link, index) => (
                        <motion.a
                          key={`${carouselIndex}-${index}`}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={{
                            scale: 1.05,
                            rotateY: 5,
                            boxShadow: '0 0 30px rgba(251,191,36,0.4)',
                          }}
                          className="group block bg-zinc-900 border border-amber-400/30 rounded-3xl overflow-hidden hover:border-amber-400 transition-all"
                        >
                          <div className="h-32 bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center text-5xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 group-hover:from-amber-400/20 via-transparent to-cyan-400/0 group-hover:to-cyan-400/10 transition-all duration-500" />
                            <span className="group-hover:scale-110 transition-transform duration-300 relative z-10">{link.emoji}</span>
                          </div>
                          <div className="p-5">
                            <div className="text-amber-400 text-xs font-mono mb-1">{link.category}</div>
                            <div className="font-bold text-base leading-tight group-hover:text-amber-100 transition-colors">{link.title}</div>
                            <div className="text-xs text-white/30 mt-1 truncate">{link.url}</div>
                          </div>
                        </motion.a>
                      ))}
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 1))}
                      disabled={carouselIndex === 0}
                      className="flex items-center gap-2 px-6 py-3 border border-white/30 rounded-2xl hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={16} /> PREVIOUS
                    </button>

                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCarouselIndex(i)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i === carouselIndex ? 'bg-amber-400 w-6' : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => setCarouselIndex(Math.min(totalPages - 1, carouselIndex + 1))}
                      disabled={carouselIndex === totalPages - 1}
                      className="flex items-center gap-2 px-6 py-3 bg-amber-400 text-black rounded-2xl font-bold hover:bg-amber-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      NEXT <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div className="text-center text-xs text-white/30 font-mono tracking-widest mt-12">
                  WITHOUT YOU, NONE OF THESE SHIPS WOULD SAIL • THE ANTI-HERO THANKS YOU 🚀
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 h-11 bg-black/80 border-t border-white/10 flex items-center justify-center text-xs font-mono text-white/40 z-40 gap-8">
        <a href="/privacy" className="hover:text-amber-400 transition-colors">PRIVACY POLICY</a>
        <span>(c) 2077 SM0K3VERSE STUDIOS — THE ANTI-HERO IS WATCHING</span>
        <a href="mailto:epictechai@gmail.com" className="hover:text-amber-400 transition-colors">CONTACT</a>
      </div>
    </div>
  );
}
