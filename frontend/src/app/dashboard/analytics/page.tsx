'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { urlService } from '@/services/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { AnalyticsView } from '@/components/AnalyticsView';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2, BarChart3, Link2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AnalyticsLandingPage() {
  const { isLoading: authLoading, token } = useAuth();
  const router = useRouter();
  const [selectedUrlId, setSelectedUrlId] = useState<string>('');

  // Fetch URLs for selection
  const { data: urls = [], isLoading: urlsLoading } = useQuery({
    queryKey: ['urls'],
    queryFn: () => urlService.listUrls(),
    enabled: !!token,
  });

  // Automatically select the first URL if available and nothing is selected
  React.useEffect(() => {
    if (urls.length > 0 && !selectedUrlId) {
      setSelectedUrlId(urls[0].id);
    }
  }, [urls, selectedUrlId]);

  if (authLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <span className="text-sm text-slate-400 font-semibold">Loading workspace...</span>
        </div>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight text-white">Link Analytics</h2>
            <p className="text-sm text-slate-400 font-medium">
              Analyze click performance, geographic and device distributions.
            </p>
          </div>

          {urls.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 shrink-0">Select Link:</span>
              <select
                value={selectedUrlId}
                onChange={(e) => setSelectedUrlId(e.target.value)}
                className="border border-purple-950/40 bg-purple-950/10 text-white focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 rounded-xl h-10 px-3 text-sm font-semibold shadow-sm transition-all outline-none cursor-pointer"
              >
                {urls.map((url) => (
                  <option key={url.id} value={url.id}>
                    {url.shortCode} ({url.originalUrl.replace(/https?:\/\/(www\.)?/, '').substring(0, 24)}...)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {urlsLoading ? (
          <div className="flex h-[350px] items-center justify-center border border-purple-950/40 bg-purple-950/15 shadow-lg shadow-black/20 rounded-2xl">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
              <span className="text-sm text-slate-400 font-semibold">Loading link data...</span>
            </div>
          </div>
        ) : urls.length === 0 ? (
          <Card className="border-purple-950/40 bg-purple-950/15 shadow-lg shadow-black/20 rounded-2xl overflow-hidden py-12">
            <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-purple-950/40 border border-purple-900/30 flex items-center justify-center text-purple-400 shadow-sm">
                <BarChart3 className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">No URL data available</h3>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-medium">
                  Create shortened links in your Dashboard workspace to unlock traffic charts, breakdowns, and log analytics.
                </p>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="glow-btn-primary rounded-xl h-10 px-5 font-semibold text-xs transition-all cursor-pointer mt-2"
              >
                Go to Dashboard
              </button>
            </CardContent>
          </Card>
        ) : (
          selectedUrlId && (
            <div className="animate-fade-in">
              <AnalyticsView urlId={selectedUrlId} onBack={() => router.push('/dashboard')} />
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  );
}
