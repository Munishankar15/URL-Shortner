'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Loader2, 
  Link2, 
  ArrowRight, 
  BarChart3, 
  Lock, 
  Globe, 
  Check, 
  Copy, 
  Zap, 
  ChevronRight 
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  
  // Interactive mock shortener states
  const [longUrl, setLongUrl] = useState('');
  const [isShortening, setIsShortening] = useState(false);
  const [shortenedResult, setShortenedResult] = useState('');
  const [copied, setCopied] = useState(false);

  // If user is logged in, redirect them to dashboard
  useEffect(() => {
    if (!isLoading && token) {
      router.push('/dashboard');
    }
  }, [token, isLoading, router]);

  const handleMockShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (!longUrl) {
      toast.error('Please paste a URL to shorten');
      return;
    }
    
    // Simple URL validation regex
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
    if (!urlPattern.test(longUrl)) {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsShortening(true);
    
    setTimeout(() => {
      // Generate a mock short slug based on domain or random characters
      let slug = 'short';
      try {
        const domain = longUrl.replace(/^(https?:\/\/)?(www\.)?/, '').split('.')[0];
        if (domain && domain.length > 2) {
          slug = domain.substring(0, 6).toLowerCase();
        }
      } catch (err) {
        slug = Math.random().toString(36).substring(2, 7);
      }
      
      const randomId = Math.random().toString(36).substring(2, 5);
      setShortenedResult(`shortlyx.co/${slug}-${randomId}`);
      setIsShortening(false);
      toast.success('Link shortened successfully (Preview Mode)!');
    }, 1000);
  };

  const handleCopy = () => {
    if (!shortenedResult) return;
    navigator.clipboard.writeText(shortenedResult);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const resetShortener = () => {
    setLongUrl('');
    setShortenedResult('');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#05020a] text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <span className="text-sm font-medium text-slate-400">Loading ShortlyX...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#05020a] text-white overflow-hidden flex flex-col justify-between selection:bg-purple-500 selection:text-white">
      {/* Background radial glow leaks */}
      <div className="absolute top-[10%] left-[-20%] w-[600px] h-[600px] bg-purple-650/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-20%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] left-[40%] -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Pill-shaped Header Navbar */}
      <header className="w-full flex justify-center pt-8 px-4 z-50">
        <div className="flex items-center justify-between w-full max-w-[680px] bg-purple-950/20 border border-purple-900/30 rounded-full py-2 px-3 sm:px-6 backdrop-blur-xl shadow-lg shadow-black/25">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <svg className="w-5 h-5 text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.5)] transition-transform duration-300 group-hover:rotate-45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
            </svg>
            <span className="font-extrabold tracking-tight text-white text-lg">ShortlyX</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-350">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#analytics" className="hover:text-white transition-colors">Analytics</Link>
            <Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm font-semibold text-slate-350 hover:text-white transition-colors px-3 py-1.5">
              Sign In
            </Link>
            <Link href="/signup" className="text-xs sm:text-sm font-bold bg-white text-black hover:bg-slate-200 rounded-full py-1.5 px-4.5 transition-all duration-200 shadow-sm cursor-pointer">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Content Section */}
      <main className="w-full max-w-5xl mx-auto px-6 pt-16 pb-24 flex flex-col items-center justify-center text-center z-20 flex-grow">
        
        {/* Pulsing Badge */}
        <div className="inline-flex items-center gap-2 bg-purple-950/40 border border-purple-500/20 rounded-full px-4.5 py-1.5 text-xs text-purple-200/90 font-medium tracking-wide mb-8 animate-fade-in shadow-[0_0_15px_rgba(168,85,247,0.05)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          Next-Gen Link Optimization Platform
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.05] max-w-4xl mb-6 bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
          Shorten. Track.<br />Optimize Your Reach.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-12 font-normal">
          ShortlyX creates sleek, powerful short links and aggregates detailed real-time audience metrics. Stop guessing—start tracking.
        </p>

        {/* Interactive URL Shortener Widget */}
        <div className="w-full max-w-[620px] bg-purple-950/10 border border-purple-900/35 p-5 sm:p-6 rounded-2xl backdrop-blur-xl shadow-xl shadow-black/30 transition-all duration-300 mb-20 text-left">
          {!shortenedResult ? (
            <form onSubmit={handleMockShorten} className="space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5 text-purple-400" />
                Paste your long URL below to test it out
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="https://your-super-long-destination-url.com/path/details"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-purple-950/20 border border-purple-900/50 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none text-sm text-white placeholder:text-slate-500 font-medium transition-all"
                  disabled={isShortening}
                />
                <button
                  type="submit"
                  disabled={isShortening}
                  className="w-full sm:w-auto h-12 bg-white text-black hover:bg-slate-200 font-bold text-sm rounded-xl px-6 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.1)] shrink-0"
                >
                  {isShortening ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Shortening...</>
                  ) : (
                    <>Shorten <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-400" />
                Test Short Link Ready!
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full h-12 px-4 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-between text-sm font-semibold text-white overflow-x-auto select-all">
                  <span>{shortenedResult}</span>
                </div>
                <div className="flex w-full sm:w-auto gap-3 shrink-0">
                  <button
                    onClick={handleCopy}
                    className="flex-1 sm:flex-initial h-12 bg-purple-900/40 border border-purple-700/30 text-white hover:bg-purple-900/60 font-bold text-sm rounded-xl px-5 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={resetShortener}
                    className="flex-1 sm:flex-initial h-12 bg-white text-black hover:bg-slate-200 font-bold text-sm rounded-xl px-5 transition-all cursor-pointer"
                  >
                    Try Another
                  </button>
                </div>
              </div>
              
              {/* Premium Upsell Prompt */}
              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-white">Save links and track user analytics</h4>
                  <p className="text-xs text-slate-400">Get click count charts, referrers, browser and device distribution dashboard.</p>
                </div>
                <Link href="/signup" className="text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg py-2 px-4 flex items-center gap-1 cursor-pointer transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  Create Account <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Features Grid Section */}
        <section id="features" className="w-full max-w-4xl pt-10 border-t border-purple-950/20">
          <div className="mb-12 text-center">
            <h2 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-3">Capabilities</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Everything you need to optimize links.</h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 text-left">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-purple-950/50 bg-purple-950/5 hover:border-purple-800/20 hover:bg-purple-950/10 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-purple-950/60 border border-purple-950 flex items-center justify-center text-purple-400 mb-4">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Detailed Analytics</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Analyze total clicks, unique referrers, devices, operating systems, and browser metrics over dynamic ranges.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-purple-950/50 bg-purple-950/5 hover:border-purple-800/20 hover:bg-purple-950/10 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-purple-950/60 border border-purple-950 flex items-center justify-center text-purple-400 mb-4">
                <Zap className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">High Performance Redirection</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Powered by a fast NestJS routing module to ensure minimal latency, redirecting users in milliseconds.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-purple-950/50 bg-purple-950/5 hover:border-purple-800/20 hover:bg-purple-950/10 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-purple-950/60 border border-purple-950 flex items-center justify-center text-purple-400 mb-4">
                <Lock className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Secure Link Storage</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Every link created is securely stored in a Postgres database and tied to your JWT authenticated account module.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border border-purple-950/50 bg-purple-950/5 hover:border-purple-800/20 hover:bg-purple-950/10 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-purple-950/60 border border-purple-950 flex items-center justify-center text-purple-400 mb-4">
                <Globe className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Clean Link Management</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Create custom URLs, search through your catalog, and delete links instantly using our modern dashboard workspace.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-10 z-20 mt-auto flex flex-col items-center gap-4 border-t border-purple-950/10 px-6 text-center">
        <div className="flex items-center gap-2">
          <svg className="w-4.5 h-4.5 text-purple-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
          </svg>
          <span className="font-extrabold tracking-tight text-white text-sm">ShortlyX</span>
        </div>
        <p className="text-[11px] font-semibold text-slate-500 tracking-wider">
          © {new Date().getFullYear()} ShortlyX. Built with Next.js, NestJS, and PostgreSQL.
        </p>
      </footer>
    </div>
  );
}
