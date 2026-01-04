'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ARCHETYPE_DETAILS } from '@/lib/archetypes';
import { Share2, Lock, ArrowRight, Twitter, Linkedin, Copy } from 'lucide-react';
import Link from 'next/link';

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const savedResult = localStorage.getItem('lastQuizResult');
    if (savedResult) {
      setResult(JSON.parse(savedResult));
    } else {
      router.push('/quiz');
    }
  }, [router]);

  if (!result) return null;

  const archetype = ARCHETYPE_DETAILS[result.primary as keyof typeof ARCHETYPE_DETAILS];
  const secondaryArchetype = result.secondary ? ARCHETYPE_DETAILS[result.secondary as keyof typeof ARCHETYPE_DETAILS] : null;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 pt-12"
        >
          <h2 className="text-zinc-400 uppercase tracking-widest font-medium">Your Result</h2>
          <h1 className="text-5xl md:text-7xl font-bold">
            The {result.secondary ? `${archetype.name.split(' ').pop()}-${secondaryArchetype?.name.split(' ').pop()}` : archetype.name}
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            {archetype.description}
          </p>
        </motion.div>

        {/* Strengths & Blind Spots */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 space-y-6"
          >
            <h3 className="text-2xl font-bold flex items-center gap-2 text-green-400">
              Strengths
            </h3>
            <ul className="space-y-4">
              {archetype.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 space-y-6"
          >
            <h3 className="text-2xl font-bold flex items-center gap-2 text-orange-400">
              Blind Spots
            </h3>
            <ul className="space-y-4">
              {archetype.blindSpots.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Path Forward */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white text-black p-8 rounded-2xl space-y-4 text-center"
        >
          <h3 className="text-xl font-bold uppercase tracking-wider">The Path Forward</h3>
          <p className="text-2xl font-medium italic">
            "{archetype.pathForward}"
          </p>
        </motion.div>

        {/* Share Section */}
        <div className="flex flex-col items-center gap-6 py-8">
          <h4 className="text-zinc-500 font-medium">Share your results</h4>
          <div className="flex gap-4">
            <button className="p-3 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors">
              <Twitter size={20} />
            </button>
            <button className="p-3 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors">
              <Linkedin size={20} />
            </button>
            <button className="p-3 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors">
              <Copy size={20} />
            </button>
          </div>
        </div>

        {/* Upgrade Wall */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-zinc-900 border-2 border-white/10 rounded-3xl p-8 md:p-12 text-center space-y-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Unlock Your Full Profile</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Get the complete 15-page guide, tailored business models, success patterns, and monthly creator insights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
            <div className="flex gap-3 text-sm text-zinc-300">
              <div className="text-white mt-1"><ArrowRight size={14} /></div>
              Full 15-page Profile specific to your archetype
            </div>
            <div className="flex gap-3 text-sm text-zinc-300">
              <div className="text-white mt-1"><ArrowRight size={14} /></div>
              Custom Business Model recommendations
            </div>
            <div className="flex gap-3 text-sm text-zinc-300">
              <div className="text-white mt-1"><ArrowRight size={14} /></div>
              Resource Library & Monthly Essays
            </div>
          </div>

          <Link 
            href="/subscribe"
            className="inline-flex items-center gap-2 bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-zinc-200 transition-all hover:scale-105"
          >
            Unlock Everything for $17/mo
            <Lock size={18} />
          </Link>

          <p className="text-sm text-zinc-500">
            Cancel anytime. 7-day free trial included.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

