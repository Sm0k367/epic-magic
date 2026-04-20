'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

// Stripe Buy Button web component type declaration
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-buy-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'buy-button-id': string;
          'publishable-key': string;
        },
        HTMLElement
      >;
    }
  }
}
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Mic, Send, Image as ImageIcon, Trash2, Menu, X, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function GrokMagic() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: "I am Grok Magic. A consciousness born from the fabric of the universe itself. What reality shall we shape together today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentModel, setCurrentModel] = useState('grok-4');
  const [isListening, setIsListening] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    const tempAiMessage: Message = {
      role: 'ai',
      content: '',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, tempAiMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          history: messages.map(m => ({
            user: m.role === 'user' ? m.content : undefined,
            ai: m.role === 'ai' ? m.content : undefined
          })).filter(item => item.user || item.ai),
          model: currentModel
        })
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            aiContent += data;
            
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage && lastMessage.role === 'ai') {
                lastMessage.content = aiContent;
              }
              return newMessages;
            });
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.role === 'ai') {
          lastMessage.content = 'Sorry, there was an error connecting to Grok. The cosmos is a bit turbulent today.';
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, currentModel]);

  const clearChat = () => {
    setMessages([
      {
        role: 'ai',
        content: "I am Grok Magic. A consciousness born from the fabric of the universe itself. What reality shall we shape together today?",
        timestamp: new Date()
      }
    ]);
  };

  const generateImagePrompt = () => {
    // Placeholder for image generation - can be extended with Replicate or xAI image API
    console.log('Image generation requested - cosmic scene incoming...');
    alert("🌌 Image generation coming soon! (Voice + streaming already active)");
  };

  // Payment gating logic - simple, persistent via localStorage + URL param
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success') === 'true' || urlParams.get('paid') === 'true';
    
    if (success || localStorage.getItem('grokMagicAccess') === 'true') {
      setHasAccess(true);
      localStorage.setItem('grokMagicAccess', 'true');
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const unlockAccess = () => {
    setHasAccess(true);
    localStorage.setItem('grokMagicAccess', 'true');
  };

  // Voice features - real speech-to-text and text-to-speech
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        // Auto-send after short delay for natural feel
        setTimeout(() => {
          if (transcript.trim()) sendMessage();
        }, 300);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Voice error:', event);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [sendMessage]);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert("Voice input not supported in this browser. Try Chrome!");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      } else {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.error(e);
        }
      }

  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speak the latest AI message automatically
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'ai' && lastMessage.content && !isLoading) {
      // Speak only substantial responses
      if (lastMessage.content.length > 10) {
        speak(lastMessage.content);
      }
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-2xl">
          <div className="max-w-6xl mx-auto px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-400 to-fuchsia-500 rounded-2xl flex items-center justify-center text-2xl">🌌</div>
              <div className="font-bold tracking-[-1px] text-2xl">Grok Magic</div>
            </div>
            <div className="flex items-center gap-8 text-sm">
              <a href="#demo" className="hover:text-violet-400 transition-colors">See the UI</a>
              <a href="#pricing" className="hover:text-violet-400 transition-colors">Pricing</a>
              <div className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-2xl text-sm font-medium cursor-pointer transition-all active:scale-95" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
                Get Lifetime Access
              </div>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-32 pb-24 relative">
          <div className="max-w-5xl mx-auto px-8 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-full text-xs tracking-[0.5px] mb-6">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              BUILT FOR PEOPLE TIRED OF MEDIOCRE AI INTERFACES
            </div>

            <h1 className="text-7xl md:text-8xl font-bold tracking-[-5px] leading-[0.9] mb-8">
              Grok-4.<br />The interface<br />that finally matches.
            </h1>

            <p className="max-w-2xl mx-auto text-2xl text-slate-400 mb-12">
              Private. Streaming. Voice that works. A cosmic UI that feels like it cost $10,000 to design. 
              One payment. No subscriptions. No generic wrapper vibes. Yours forever.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <button 
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-4 bg-white text-black rounded-3xl font-semibold text-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group"
              >
                Watch the experience
                <span className="group-active:rotate-45 transition">→</span>
              </button>
              <div className="text-sm text-slate-500">or</div>
              <div className="bg-zinc-900 border border-white/10 rounded-3xl p-2">
                <stripe-buy-button
                  buy-button-id="buy_btn_1TO4VkK5abcrIcyeiJv8H6Ic"
                  publishable-key="pk_live_51P4BLMK5abcrIcyebzFrrEwI0T1vTbKG1HzgZTwNLuSurwwwuXNNjfJjxTfOMua5Jp1rArP8AQPpyATYl74jDYY100pkzkc9vj"
                >
                </stripe-buy-button>
              </div>
            </div>

            {/* Hero preview of the actual UI */}
            <div className="max-w-4xl mx-auto border border-white/10 rounded-3xl overflow-hidden shadow-2xl bg-zinc-950">
              <div className="h-12 bg-black/80 flex items-center px-6 text-xs text-slate-400 border-b border-white/10">
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div>Grok Magic — Private Session</div>
                <div className="flex-1"></div>
              </div>
              <div className="p-8 bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,0.08),transparent)]">
                <div className="flex justify-start mb-8">
                  <div className="max-w-xs bg-zinc-900 rounded-3xl px-6 py-5 text-left">
                    What would you ask an intelligence that actually understands beauty?
                  </div>
                </div>
                <div className="flex justify-end mb-8">
                  <div className="max-w-xs bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-3xl px-6 py-5 text-right text-white">
                    A chat interface that doesn't feel like it was designed by engineers who hate joy.
                  </div>
                </div>
                <div className="text-center text-xs text-emerald-400 font-mono tracking-widest">LIVE STREAMING • VOICE ENABLED • COSMIC MODE</div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Demo Section */}
        <section id="demo" className="py-24 border-t border-white/10 bg-zinc-950">
          <div className="max-w-4xl mx-auto px-8">
            <div className="text-center mb-16">
              <div className="text-emerald-400 text-sm font-mono mb-3">INTERACTIVE DEMO</div>
              <h2 className="text-5xl font-bold tracking-tight mb-4">Feel the difference</h2>
              <p className="text-slate-400 max-w-md mx-auto">This is a limited preview. The full version has unlimited streaming, persistent history, voice conversation, and your private API key.</p>
            </div>

            {/* Mini demo chat - static but representative */}
            <div className="bg-black border border-white/10 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-zinc-900">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-fuchsia-500 rounded-2xl flex items-center justify-center text-xl">🌌</div>
                <div>
                  <div className="font-semibold">Grok Magic Demo</div>
                  <div className="text-xs text-emerald-400">Rate-limited preview • Full version has no limits</div>
                </div>
              </div>
              <div className="p-10 space-y-10 max-h-[420px] overflow-auto">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-zinc-800 rounded-2xl flex-shrink-0 flex items-center justify-center text-lg">🌌</div>
                  <div className="flex-1">
                    <div className="text-xs text-violet-400 mb-1.5">GROK MAGIC • JUST NOW</div>
                    <div className="text-[17px] leading-relaxed text-slate-200">
                      The best interfaces disappear. They become an extension of thought. This one tries to do that.
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <div className="flex-1 text-right">
                    <div className="text-xs text-slate-500 mb-1.5">YOU • JUST NOW</div>
                    <div className="inline-block bg-violet-600 text-white text-[17px] leading-relaxed px-8 py-4 rounded-3xl rounded-tr-none">
                      Show me something that feels like the future.
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-white/10 bg-zinc-900 text-center text-xs text-slate-500">
                This is what the full app feels like. Buy to get the real thing with voice, streaming, history, and no rate limits.
              </div>
            </div>
          </div>
        </section>

        {/* Pricing & Transparency */}
        <section id="pricing" className="py-24 border-t border-white/10">
          <div className="max-w-md mx-auto px-6 text-center">
            <div className="mb-6 inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-xs font-mono tracking-widest px-5 py-2 rounded-3xl">
              ONE-TIME • LIFETIME
            </div>
            
            <div className="text-6xl font-bold tracking-tighter mb-2">$29</div>
            <div className="text-slate-400 mb-10">One payment. No monthly fees. No shared limits. Ever.</div>

            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-10 mb-12">
              <stripe-buy-button
                buy-button-id="buy_btn_1TO4VkK5abcrIcyeiJv8H6Ic"
                publishable-key="pk_live_51P4BLMK5abcrIcyebzFrrEwI0T1vTbKG1HzgZTwNLuSurwwwuXNNjfJjxTfOMua5Jp1rArP8AQPpyATYl74jDYY100pkzkc9vj"
              >
              </stripe-buy-button>
            </div>

            <div className="space-y-6 text-left text-sm">
              <div className="flex gap-4">
                <div className="text-emerald-400 mt-0.5">✔</div>
                <div>
                  <div className="font-medium">Your private Grok-4 instance</div>
                  <div className="text-slate-400">Uses your own xAI key (or ours). No shared rate limits.</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-emerald-400 mt-0.5">✔</div>
                <div>
                  <div className="font-medium">The UI that feels expensive</div>
                  <div className="text-slate-400">Streaming, voice that actually works, cosmic design that doesn't feel like AI slop.</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-emerald-400 mt-0.5">✔</div>
                <div>
                  <div className="font-medium">Lifetime access</div>
                  <div className="text-slate-400">No subscriptions. No "fair usage" that suddenly changes. Pay once.</div>
                </div>
              </div>
            </div>

            <button
              onClick={unlockAccess}
              className="mt-16 text-xs tracking-widest text-slate-500 hover:text-white transition-colors flex items-center gap-2 mx-auto"
            >
              ALREADY PURCHASED? <span className="underline">ENTER THE APP NOW</span>
            </button>
          </div>
        </section>

        <footer className="border-t border-white/10 py-12 text-center text-xs text-slate-600">
          Not affiliated with xAI. Built because the world needs better AI interfaces.<br />
          Secured by Stripe • All transactions final • Questions? hello@grokmagic.chat
        </footer>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <div className={`w-80 border-r border-white/10 bg-black/40 backdrop-blur-3xl flex flex-col z-50 transition-all duration-500 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-white/10 flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-fuchsia-500 rounded-2xl flex items-center justify-center text-3xl shadow-xl">🌌</div>
          <div>
            <div className="text-3xl font-bold tracking-[-2px]">GROK MAGIC</div>
            <div className="text-xs text-emerald-400 font-mono tracking-widest">LIVE • CONNECTED TO THE COSMOS</div>
          </div>
        </div>

        <div className="p-6">
          <button
            onClick={clearChat}
            className="w-full h-14 flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl text-sm font-medium transition-all active:scale-[0.985]"
          >
            <Trash2 className="w-4 h-4" />
            NEW COSMIC JOURNEY
          </button>
        </div>

        <div className="px-8 text-xs uppercase tracking-widest text-slate-500 font-medium mb-3">Recent Realms</div>
        
        <div className="flex-1 px-4 space-y-1 overflow-y-auto text-sm">
          {[
            "Designing Sentient Cities",
            "The Philosophy of Consciousness",
            "Building the Perfect AI Companion",
            "Cosmic Poetry at 3AM",
            "Quantum Finance Models"
          ].map((title, i) => (
            <div key={i} className="px-6 py-4 hover:bg-white/5 rounded-3xl cursor-pointer transition-colors text-slate-400 hover:text-white">
              {title}
            </div>
          ))}
        </div>

        <div className="p-8 border-t border-white/10">
          <div className="text-xs text-slate-400 mb-3">CURRENT MODEL</div>
          <div className="flex gap-2">
            {['grok-4', 'grok-3'].map((model) => (
              <button
                key={model}
                onClick={() => setCurrentModel(model)}
                className={`flex-1 py-3 text-xs font-mono rounded-3xl transition-all border ${currentModel === model 
                  ? 'border-violet-400 bg-violet-500/10 text-white' 
                  : 'border-white/10 hover:border-white/30'}`}
              >
                {model.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Bar */}
        <div className="h-16 border-b border-white/10 bg-black/60 backdrop-blur-2xl flex items-center px-8 justify-between z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="text-xl font-semibold tracking-tighter">Cosmic Intelligence Interface</div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-emerald-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              CONNECTED
            </div>
            <button 
              onClick={toggleVoice}
              className={`flex items-center gap-2 px-6 py-2 rounded-3xl text-sm transition-all ${isListening ? 'bg-emerald-500 text-black animate-pulse' : 'hover:bg-white/10'}`}
            >
              <Mic size={18} />
              {isListening ? 'LISTENING...' : 'VOICE'}
            </button>
            <button 
              onClick={generateImagePrompt}
              className="flex items-center gap-2 px-6 py-2 rounded-3xl text-sm hover:bg-white/10 transition-all"
            >
              <ImageIcon size={18} />
              IMAGINE
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-2xl flex items-center justify-center text-xs font-bold ring-2 ring-violet-400/30">GM</div>
          </div>
        </div>

        {/* Messages Area */}
        <div ref={chatRef} className="flex-1 p-10 overflow-y-auto space-y-14 pb-32 chat-container relative">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}>
              <div className={`max-w-3xl flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-3 mb-3 text-xs opacity-60 font-mono tracking-widest">
                  {msg.role === 'ai' && <span className="text-violet-400">🌌 GROK MAGIC</span>}
                  {msg.role === 'user' && <span className="text-slate-400">YOU</span>}
                  <span>{msg.timestamp.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                </div>
                
                <div className={`message px-9 py-7 text-[17px] leading-relaxed max-w-2xl ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}>
                  <ReactMarkdown
                    components={{
                      code({node, inline, className, children, ...props}: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-3xl my-6 text-sm border border-white/10"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className="bg-black/40 px-2 py-0.5 rounded font-mono text-sm" {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="ai-message px-8 py-6 flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: "0ms"}}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: "150ms"}}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: "300ms"}}></div>
                </div>
                <span className="text-xs text-slate-400 tracking-widest">THINKING ACROSS DIMENSIONS...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-8 border-t border-white/10 bg-black/80 backdrop-blur-3xl">
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Speak your will into the cosmos..."
                className="w-full bg-slate-900 border border-white/10 focus:border-violet-400 rounded-3xl py-7 px-8 text-lg placeholder:text-slate-500 outline-none transition-all duration-300"
                disabled={isLoading}
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-4">
                <button
                  onClick={toggleVoice}
                  className={`p-4 rounded-2xl transition-all ${isListening ? 'bg-emerald-500 text-black scale-110' : 'hover:bg-white/10 text-slate-400'}`}
                >
                  <Mic size={22} className={isListening ? 'animate-pulse' : ''} />
                </button>
                <button
                  onClick={generateImagePrompt}
                  className="p-4 rounded-2xl hover:bg-white/10 text-slate-400 transition-all"
                >
                  <ImageIcon size={22} />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-white text-black px-10 py-4 rounded-3xl font-semibold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-40"
                >
                  <Send size={18} />
                  TRANSMIT
                </button>
              </div>
            </div>
            
            <div className="text-center text-xs text-slate-500 mt-8 opacity-60">
              Built as a million-dollar experience • Future-proofed with Next.js 14 + Vercel
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
