'use client';

import React, { use } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { AnalyticsView } from '@/components/AnalyticsView';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AnalyticsPage({ params }: PageProps) {
  const { isLoading, token } = useAuth();
  const router = useRouter();
  const { id } = use(params);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
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
      <AnalyticsView urlId={id} onBack={() => router.push('/dashboard')} />
    </DashboardLayout>
  );
}
