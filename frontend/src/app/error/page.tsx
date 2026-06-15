'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertTriangle, Clock, Activity, ArrowLeft, Home } from 'lucide-react';

function ErrorPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get('type');

  let title = 'Something went wrong';
  let description = 'We encountered an error processing your request. Please try again later.';
  let Icon = AlertTriangle;

  if (type === 'not_found') {
    title = 'Link not found';
    description = 'The short URL you are trying to access does not exist or has been deleted.';
  } else if (type === 'expired') {
    title = 'Link has expired';
    description = 'This shortened link is no longer active because it has reached its expiration date and time.';
    Icon = Clock;
  } else if (type === 'limit_reached') {
    title = 'Click limit reached';
    description = 'This link is currently inactive because it has crossed its maximum click capacity limit.';
    Icon = Activity;
  }

  return (
    <div className="relative min-h-screen w-full bg-[#05020a] text-white flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-650/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-purple-950/15 border border-purple-950/50 backdrop-blur-2xl rounded-3xl p-8 text-center space-y-8 z-10 shadow-2xl shadow-black/55">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-2xl bg-purple-950/50 border border-purple-900/30 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/5">
            <Icon className="h-8 w-8 animate-pulse text-purple-400" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight text-white">{title}</h1>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">{description}</p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={() => router.back()}
            className="w-full h-11 bg-purple-900/40 border border-purple-800/30 hover:bg-purple-900/60 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full h-11 bg-white text-black hover:bg-slate-200 font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-sm"
          >
            <Home className="h-4 w-4" /> Back to Home
          </button>
        </div>
      </div>

      <div className="mt-8 text-[11px] font-bold text-slate-600 uppercase tracking-widest z-10">
        ShortlyX Link Protection
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-screen items-center justify-center bg-[#05020a] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    }>
      <ErrorPageContent />
    </Suspense>
  );
}

// Inline fallback loader helper
import { Loader2 } from 'lucide-react';
