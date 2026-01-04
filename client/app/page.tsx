import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const archetypes = [
    "Permissionless Operator", "Systems Thinker", "Audience Builder",
    "Creator Obsessive", "Hybrid Hustler", "Validator Seeker",
    "The Builder", "The Thinker/Writer", "The Connector"
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-white/[0.03] rounded-full blur-3xl -z-10" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.9]">
            Discover Your <br />
            <span className="text-zinc-400">Creator Archetype.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            Understand how you’re naturally inclined to build, and exactly what you need to succeed in the creator economy.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/quiz"
              className="w-full md:w-auto bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:bg-zinc-200 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Take the 10-Minute Quiz
              <ArrowRight size={20} />
            </Link>
            <p className="text-zinc-500 text-sm">No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Archetypes Grid */}
      <section className="py-24 px-4 bg-zinc-900/50 border-y border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold">The 9 Archetypes</h2>
            <p className="text-zinc-500">Every creator fits into one of these fundamental patterns.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-8">
            {archetypes.map((type, i) => (
              <div key={i} className="bg-black/50 p-6 rounded-2xl border border-zinc-800 hover:border-zinc-600 transition-colors">
                <h3 className="font-bold text-lg">{type}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing/Features */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">What You Get</h2>
              <p className="text-zinc-500 text-lg leading-relaxed">
                The VV Profile is more than a personality test. It's a business operating system tailored to your unique psychological profile.
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="font-bold text-zinc-400 uppercase tracking-widest text-sm">Free</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-zinc-300">
                    <CheckCircle2 size={18} className="text-zinc-600" />
                    Quiz results & Archetype diagnosis
                  </li>
                  <li className="flex gap-3 text-zinc-300">
                    <CheckCircle2 size={18} className="text-zinc-600" />
                    Key strengths & blind spots
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-bold text-white uppercase tracking-widest text-sm">Pro — $17/mo</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-zinc-300">
                    <CheckCircle2 size={18} className="text-white" />
                    Full 15-page archetype profile
                  </li>
                  <li className="flex gap-3 text-zinc-300">
                    <CheckCircle2 size={18} className="text-white" />
                    Custom business model playbook
                  </li>
                  <li className="flex gap-3 text-zinc-300">
                    <CheckCircle2 size={18} className="text-white" />
                    Monthly creator insights & resources
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-zinc-800 text-center text-zinc-600 text-sm">
        <p>© 2026 VV Profile. All rights reserved.</p>
      </footer>
    </div>
  );
}
