'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(#1a1428_1px,transparent_1px)] [background-size:40px_40px] opacity-50" />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-amber-500/5 via-transparent to-black" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors mb-12 font-mono text-sm tracking-widest">
          <ArrowLeft size={16} /> RETURN TO THE PORTAL
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-amber-400 text-xs font-mono tracking-widest mb-4">SM0K3VERSE STUDIOS • 2077</div>
          <h1 className="text-6xl font-black tracking-tighter mb-8 neon-text">PRIVACY POLICY</h1>
          <p className="text-white/50 font-mono text-sm mb-16">Last updated: April 2026</p>

          <div className="space-y-12 text-white/80">
            <section>
              <h2 className="text-2xl font-bold text-amber-400 mb-4">1. The Signal We Collect</h2>
              <p className="leading-relaxed">
                When you transmit through our portal, we may collect basic signals like your name,
                email address, and the details of your project transmission. We also collect
                standard server logs including IP addresses, browser type, and pages visited.
                This is how the network stays alive.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-400 mb-4">2. How We Use Your Signal</h2>
              <p className="leading-relaxed">
                Your data is used solely to respond to your transmissions, improve the portal experience,
                and deliver cinematic web experiences you hired us to build. We do not sell,
                trade, or broadcast your signal to third parties. The anti-hero keeps secrets.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-400 mb-4">3. AI Transmissions</h2>
              <p className="leading-relaxed">
                Chat messages sent through the portal are processed by the xAI Grok 4 API.
                These transmissions may be subject to xAI&apos;s privacy policy. We recommend
                not sharing personally sensitive information in chat messages. The sprawl
                has ears.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-400 mb-4">4. Cookies & Tracking</h2>
              <p className="leading-relaxed">
                This portal uses minimal cookies for essential functionality only. We do not
                use advertising cookies or cross-site tracking. Vercel, our hosting provider,
                may collect anonymous analytics. The portal does not track you across the web.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-400 mb-4">5. Data Security</h2>
              <p className="leading-relaxed">
                Your signals are protected using industry-standard encryption. We use HTTPS
                across all transmissions. However, no portal in the sprawl is 100% secure —
                transmit sensitive information at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-400 mb-4">6. Your Rights</h2>
              <p className="leading-relaxed">
                You have the right to request deletion of your data, access what we hold about you,
                and opt out of any non-essential communications. Transmit your requests to:
                <a href="mailto:epictechai@gmail.com" className="text-amber-400 hover:text-amber-300 ml-2 transition-colors">
                  epictechai@gmail.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-400 mb-4">7. Third-Party Links</h2>
              <p className="leading-relaxed">
                The portal contains links to external sites across the universe. We are not
                responsible for the privacy practices of those sites. When you follow a portal
                link, you enter their signal space.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-amber-400 mb-4">8. Contact the Anti-Hero</h2>
              <p className="leading-relaxed">
                Questions about this privacy policy? Open a transmission to{' '}
                <a href="mailto:epictechai@gmail.com" className="text-amber-400 hover:text-amber-300 transition-colors">
                  epictechai@gmail.com
                </a>
                . The anti-hero will respond from the sprawl.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 text-center">
            <p className="text-white/30 font-mono text-xs tracking-widest">
              (c) 2077 SM0K3VERSE STUDIOS — THE ANTI-HERO IS WATCHING
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
