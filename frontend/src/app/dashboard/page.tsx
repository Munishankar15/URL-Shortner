'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/DashboardLayout';
import { CreateUrlForm } from '../../components/CreateUrlForm';
import { UrlTable } from '../../components/UrlTable';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { isLoading, token } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <span className="text-sm text-slate-400 font-semibold">Loading workspace...</span>
        </div>
      </div>
    );
  }

  // Auth Guard: if no token, don't show the dashboard content (AuthProvider handles redirection to /login)
  if (!token) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-white">Dashboard</h2>
          <p className="text-sm text-slate-400 font-medium">
            Create, search, and manage your shortened links with real-time performance analytics.
          </p>
        </div>
        
        <CreateUrlForm />
        
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Your Short Links</h3>
          <UrlTable onViewAnalytics={(id) => router.push(`/dashboard/analytics/${id}`)} />
        </div>
      </div>
    </DashboardLayout>
  );
}
