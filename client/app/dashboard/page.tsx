'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, 
  FileText, 
  BookOpen, 
  Library, 
  Settings, 
  LogOut,
  ChevronRight,
  Lock
} from 'lucide-react';
import axios from 'axios';
import { ARCHETYPE_DETAILS } from '@/lib/archetypes';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('my_profile');
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // In a real app, these would be separate calls or one combined call
        // const userRes = await axios.get(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
        // setUser(userRes.data);
        
        // Mocking user for now
        setUser({ name: 'Jack Butcher', archetype: 'SYSTEMS_THINKER' });
        
        // const subRes = await axios.get(`${API_URL}/subscription/status`, { headers: { Authorization: `Bearer ${token}` } });
        // setSubscription(subRes.data);
        setSubscription({ status: 'ACTIVE' }); // Mock active sub
      } catch (error) {
        console.error('Failed to fetch user data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );

  const archetype = ARCHETYPE_DETAILS[user?.archetype as keyof typeof ARCHETYPE_DETAILS];

  const tabs = [
    { id: 'my_profile', name: 'My Profile', icon: User, premium: false },
    { id: 'full_profile', name: 'Full Profile', icon: FileText, premium: true },
    { id: 'business_guide', name: 'Business Guide', icon: BookOpen, premium: true },
    { id: 'resources', name: 'Resources', icon: Library, premium: true },
    { id: 'settings', name: 'Settings', icon: Settings, premium: false },
  ];

  const isSubscribed = subscription?.status === 'ACTIVE';

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-zinc-800 p-6 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg" />
          <span className="font-bold text-xl tracking-tight">VV Profile</span>
        </div>

        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                activeTab === tab.id ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon size={18} />
                <span className="font-medium">{tab.name}</span>
              </div>
              {tab.premium && !isSubscribed && <Lock size={14} className="text-zinc-700" />}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-zinc-800 mt-auto">
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              router.push('/');
            }}
            className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors p-3 w-full"
          >
            <LogOut size={18} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name.split(' ')[0]}</h1>
            <p className="text-zinc-500">Your Archetype: {archetype?.name}</p>
          </div>
          <div className="hidden md:block">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              isSubscribed ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-zinc-800 text-zinc-500'
            }`}>
              {isSubscribed ? 'Pro Subscriber' : 'Free Account'}
            </span>
          </div>
        </header>

        {/* Tab Content */}
        <div className="max-w-4xl">
          {activeTab === 'my_profile' && (
            <div className="space-y-8">
              <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center text-black">
                  <span className="text-4xl font-bold">ST</span>
                </div>
                <div className="flex-1 text-center md:text-left space-y-2">
                  <h2 className="text-2xl font-bold">{archetype?.name}</h2>
                  <p className="text-zinc-400">{archetype?.description}</p>
                </div>
                <button 
                  onClick={() => router.push('/quiz')}
                  className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-zinc-200"
                >
                  Retake Quiz
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                  <h3 className="font-bold mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Quiz Attempts</span>
                      <span>2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Member Since</span>
                      <span>Jan 2026</span>
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                  <h3 className="font-bold mb-4">Subscription</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Status</span>
                      <span className="text-green-500">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Next Billing</span>
                      <span>Feb 4, 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'full_profile' && (
            !isSubscribed ? (
              <UpgradePrompt />
            ) : (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold">Full Profile</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-zinc-400 text-lg">
                    This is your detailed 15-page guide to navigating the creator economy as a {archetype?.name}.
                  </p>
                  <div className="mt-8 space-y-6">
                    <section className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
                      <h3 className="text-xl font-bold mb-4">How Your Mind Works</h3>
                      <p className="text-zinc-400">
                        As a Systems Thinker, your brain is naturally wired to seek out patterns and efficiencies. 
                        While others see chaos, you see a set of interconnected components that can be optimized...
                      </p>
                    </section>
                    {/* More sections... */}
                  </div>
                </div>
              </div>
            )
          )}

          {/* ... Other tab contents ... */}
        </div>
      </div>
    </div>
  );
}

function UpgradePrompt() {
  return (
    <div className="bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-3xl p-12 text-center space-y-6">
      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
        <Lock className="text-zinc-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Premium Content Locked</h2>
        <p className="text-zinc-400 max-w-md mx-auto">
          Upgrade to a Pro account to unlock your full profile, business guide, and the complete resource library.
        </p>
      </div>
      <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-zinc-200">
        Unlock for $17/mo
      </button>
    </div>
  );
}

