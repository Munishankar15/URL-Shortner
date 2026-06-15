'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { urlService } from '../../../services/api';
import { toast } from 'sonner';
import { Loader2, Lock, ArrowRight, Home } from 'lucide-react';

export default function PasswordPrompt() {
  const params = useParams();
  const router = useRouter();
  const code = (Array.isArray(params.code) ? params.code[0] : params.code) || '';

  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error('Please enter a password');
      return;
    }

    setIsVerifying(true);
    try {
      const originalUrl = await urlService.verifyPassword(code, password);
      toast.success('Access granted! Redirecting...');
      // Perform redirect
      window.location.href = originalUrl;
    } catch (err: any) {
      setIsVerifying(false);
      const errMsg = err.response?.data?.message || 'Verification failed. Incorrect password.';
      toast.error(errMsg);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#05020a] text-white flex flex-col items-center justify-center p-6 overflow-hidden select-none">
      {/* Background glow */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-650/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-purple-950/15 border border-purple-950/50 backdrop-blur-2xl rounded-3xl p-8 z-10 shadow-2xl shadow-black/55">
        <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8">
          <div className="h-14 w-14 rounded-2xl bg-purple-950/50 border border-purple-900/30 flex items-center justify-center text-purple-400">
            <Lock className="h-6 w-6 text-purple-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-white">Protected Link</h1>
            <p className="text-sm text-slate-400 font-medium">
              This link is password protected. Enter the password below to access the destination.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="pass" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              id="pass"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-purple-950/20 border border-purple-900/50 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 outline-none text-sm text-white placeholder:text-slate-600 font-medium transition-all"
              disabled={isVerifying}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full h-12 bg-white text-black hover:bg-slate-200 disabled:opacity-50 font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-sm"
          >
            {isVerifying ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</>
            ) : (
              <>Access Link <ArrowRight className="h-4 w-4" /></>
            )}
          </button>
        </form>

        <div className="pt-6 mt-6 border-t border-purple-950/40 flex justify-center">
          <button
            onClick={() => router.push('/')}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Home className="h-3.5 w-3.5" /> Back to Home
          </button>
        </div>
      </div>

      <div className="mt-8 text-[11px] font-bold text-slate-600 uppercase tracking-widest z-10">
        ShortlyX Link Protection
      </div>
    </div>
  );
}
