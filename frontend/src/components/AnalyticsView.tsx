'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { urlService, getShortUrl } from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  Calendar,
  MousePointerClick,
  ExternalLink,
  Laptop,
  Globe,
  Clock,
  Download,
  Copy,
  Check,
  FileSpreadsheet,
  QrCode,
  Loader2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
  CartesianGrid,
} from 'recharts';

interface AnalyticsViewProps {
  urlId: string;
  onBack: () => void;
}

const COLORS = ['#a855f7', '#d946ef', '#6366f1', '#c084fc', '#f472b6', '#3b82f6'];

export function AnalyticsView({ urlId, onBack }: AnalyticsViewProps) {
  const [qrColor, setQrColor] = useState('#a855f7');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { data: details, isLoading, error } = useQuery({
    queryKey: ['analytics', urlId],
    queryFn: () => urlService.getUrlAnalytics(urlId),
  });

  useEffect(() => {
    if (details?.url?.shortCode) {
      QRCode.toDataURL(getShortUrl(details.url.shortCode), {
        color: {
          dark: qrColor,
          light: '#00000000', // transparent background
        },
        width: 320,
        margin: 2,
      })
        .then((url) => setQrCodeUrl(url))
        .catch(() => toast.error('Failed to generate QR Code'));
    } else {
      setQrCodeUrl('');
    }
  }, [details?.url?.shortCode, qrColor]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-slate-400 hover:text-white hover:bg-purple-950/20 rounded-xl">
          <ArrowLeft className="h-4 w-4" /> Back to Links
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-28 bg-purple-950/20 rounded-2xl" />
          <Skeleton className="h-28 bg-purple-950/20 rounded-2xl" />
          <Skeleton className="h-28 bg-purple-950/20 rounded-2xl" />
        </div>
        <Skeleton className="h-80 w-full bg-purple-950/20 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 bg-purple-950/20 rounded-2xl" />
          <Skeleton className="h-64 bg-purple-950/20 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="space-y-6 text-center py-12">
        <p className="text-rose-450">Failed to load analytics details.</p>
        <Button onClick={onBack} className="glow-btn-primary shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const { url, analytics } = details;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBrowserIcon = (browserName: string) => {
    const name = browserName.toLowerCase();
    if (name.includes('chrome')) return <Globe className="h-4 w-4 text-purple-400" />;
    return <Globe className="h-4 w-4 text-slate-500" />;
  };

  const downloadQR = async (format: 'png' | 'svg') => {
    if (!url) return;

    try {
      const filename = `shortlyx-qr-${url.shortCode}.${format}`;

      if (format === 'png') {
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('PNG QR Code downloaded!');
      } else {
        const svgString = await QRCode.toString(getShortUrl(url.shortCode), {
          type: 'svg',
          color: {
            dark: qrColor,
            light: '#00000000',
          },
        });
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
        toast.success('SVG QR Code downloaded!');
      }
    } catch (err) {
      toast.error('Failed to download QR Code');
    }
  };

  const handleCopy = () => {
    if (!url?.shortCode) return;
    navigator.clipboard.writeText(getShortUrl(url.shortCode));
    setCopied(true);
    toast.success('Short link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const csvContent = await urlService.exportAnalyticsCsv(urlId);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.setAttribute('download', `shortlyx-analytics-${url.shortCode || urlId}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
      toast.success('Analytics CSV exported successfully!');
    } catch (err) {
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const formatHour = (hour: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour} ${ampm}`;
  };

  const hourlyChartData = (analytics.hourlyBreakdown || []).map((item) => ({
    hourLabel: formatHour(item.hour),
    clicks: item.count,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button variant="ghost" onClick={onBack} className="self-start gap-2 text-slate-400 hover:text-white hover:bg-purple-950/20 border border-purple-900/10 rounded-xl cursor-pointer shadow-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Links
        </Button>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-purple-950/15 border border-purple-950/40 px-4 py-2 rounded-xl shadow-sm">
          <Calendar className="h-4 w-4 text-purple-400" />
          <span>Created on {new Date(url.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Header Info */}
      <div className="p-6 rounded-2xl border border-purple-950/40 bg-purple-950/15 backdrop-blur-3xl space-y-4 shadow-xl shadow-black/20">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-950/40 border border-purple-900/30 text-purple-400 uppercase tracking-wide shadow-sm">
            Active Short Link
          </span>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <a
              href={getShortUrl(url.shortCode)}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
            >
              {getShortUrl(url.shortCode)}
            </a>
          </h2>
          <div className="text-sm font-bold text-slate-400 truncate flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500 uppercase text-xs tracking-wider font-extrabold">Redirects to:</span>
            <a
              href={url.originalUrl}
              target="_blank"
              rel="noreferrer"
              className="text-purple-400 hover:text-purple-350 font-bold underline underline-offset-4 decoration-purple-500/20 hover:decoration-purple-500 inline-flex items-center gap-1.5 transition-colors"
            >
              {url.originalUrl}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-purple-950/40 bg-purple-950/15 backdrop-blur-3xl shadow-xl shadow-black/20 hover:border-purple-500/20 transition-all duration-300 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Total Clicks</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/10">
              <MousePointerClick className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-4xl font-black text-white">{analytics.totalClicks}</div>
            <p className="text-xs text-slate-400 mt-1 font-bold">Lifetime redirections</p>
          </CardContent>
        </Card>

        <Card className="border-purple-950/40 bg-purple-950/15 backdrop-blur-3xl shadow-xl shadow-black/20 hover:border-purple-500/20 transition-all duration-300 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Last Visited</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/10">
              <Clock className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-2xl font-black text-white truncate">
              {analytics.lastVisited ? new Date(analytics.lastVisited).toLocaleDateString() : 'Never'}
            </div>
            <p className="text-xs text-slate-400 mt-1 font-bold">
              {analytics.lastVisited ? new Date(analytics.lastVisited).toLocaleTimeString() : 'No clicks tracked yet'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-950/40 bg-purple-950/15 backdrop-blur-3xl shadow-xl shadow-black/20 hover:border-purple-500/20 transition-all duration-300 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Avg. Click Rate</CardTitle>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-fuchsia-400 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-fuchsia-500/10">
              <Laptop className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-4xl font-black text-white">
              {analytics.clickHistory.length > 0
                ? (analytics.totalClicks / analytics.clickHistory.length).toFixed(1)
                : 0}
            </div>
            <p className="text-xs text-slate-400 mt-1 font-bold">Clicks per active day</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Column (Left/Center) */}
        <div className="lg:col-span-3 space-y-6">
          {/* History Timeline Chart */}
          <Card className="border-purple-950/40 bg-purple-950/15 backdrop-blur-3xl shadow-xl shadow-black/20 rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-black text-white">Click History Chart</CardTitle>
              <CardDescription className="text-slate-400 text-sm font-medium">
                Daily click count timeline tracking traffic spikes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full mt-4">
                {analytics.clickHistory.length === 0 ? (
                  <div className="h-full w-full flex items-center justify-center text-sm font-bold text-slate-550">
                    No visitor data available to render click history timeline.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.clickHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0.01} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="oklch(0.16 0.04 295 / 40%)" strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        className="font-bold"
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        className="font-bold"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#120d1e',
                          borderColor: 'oklch(0.16 0.04 295 / 60%)',
                          borderRadius: '16px',
                          color: '#ffffff',
                          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
                          fontWeight: 'bold',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        name="Clicks"
                        stroke="#a855f7"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorClicks)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Device and Browser Breakdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Device Breakdown */}
            <Card className="border-purple-950/40 bg-purple-950/15 backdrop-blur-3xl shadow-xl shadow-black/20 rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-black text-white">Devices Distribution</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center h-64">
                {analytics.deviceBreakdown.length === 0 ? (
                  <p className="text-sm font-bold text-slate-550">No device data tracked.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.deviceBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {analytics.deviceBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#120d1e',
                          borderColor: 'oklch(0.16 0.04 295 / 60%)',
                          borderRadius: '16px',
                          color: '#ffffff',
                          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
                          fontWeight: 'bold',
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        iconSize={10}
                        iconType="circle"
                        formatter={(value) => <span className="text-xs text-slate-400 font-bold">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Browser Breakdown */}
            <Card className="border-purple-950/40 bg-purple-950/15 backdrop-blur-3xl shadow-xl shadow-black/20 rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-black text-white">Browsers Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                {analytics.browserBreakdown.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm font-bold text-slate-550">
                    No browser data tracked.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.browserBreakdown} layout="vertical" margin={{ left: -10, right: 10 }}>
                      <XAxis type="number" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis
                        dataKey="name"
                        type="category"
                        stroke="#64748b"
                        fontSize={11}
                        axisLine={false}
                        tickLine={false}
                        className="font-bold"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#120d1e',
                          borderColor: 'oklch(0.16 0.04 295 / 60%)',
                          borderRadius: '16px',
                          color: '#ffffff',
                          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
                          fontWeight: 'bold',
                        }}
                      />
                      <Bar dataKey="value" name="Clicks" radius={[0, 4, 4, 0]}>
                        {analytics.browserBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Hourly Heatmap & Referrers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hourly heatmap clicks volume visualizer */}
            <Card className="border-purple-950/40 bg-purple-950/15 backdrop-blur-3xl shadow-xl shadow-black/20 rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-black text-white">Hourly Clicks Volume</CardTitle>
                <CardDescription className="text-slate-400 text-sm font-medium">
                  Hourly click volume breakdown throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                {analytics.hourlyBreakdown.length === 0 || analytics.totalClicks === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm font-bold text-slate-550">
                    No hourly data tracked yet.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="oklch(0.16 0.04 295 / 40%)" strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="hourLabel"
                        stroke="#64748b"
                        fontSize={9}
                        tickLine={false}
                        axisLine={false}
                        className="font-bold"
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={9}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        className="font-bold"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#120d1e',
                          borderColor: 'oklch(0.16 0.04 295 / 60%)',
                          borderRadius: '16px',
                          color: '#ffffff',
                          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
                          fontWeight: 'bold',
                        }}
                      />
                      <Bar dataKey="clicks" name="Clicks" fill="#818cf8" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Referrer Click Origins list */}
            <Card className="border-purple-950/40 bg-purple-950/15 backdrop-blur-3xl shadow-xl shadow-black/20 rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-black text-white">Referrer Origins</CardTitle>
                <CardDescription className="text-slate-400 text-sm font-medium">
                  Traffic referral sources distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 overflow-y-auto pr-2 custom-scrollbar">
                {!analytics.referrerBreakdown || analytics.referrerBreakdown.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm font-bold text-slate-550">
                    No referrer data tracked.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analytics.referrerBreakdown.map((item, index) => {
                      const totalReferrerClicks = analytics.referrerBreakdown.reduce((sum, r) => sum + r.value, 0);
                      const percentage = totalReferrerClicks > 0 ? (item.value / totalReferrerClicks) * 100 : 0;
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                            <span className="text-slate-300 truncate max-w-[65%]" title={item.name}>
                              {item.name}
                            </span>
                            <span className="text-purple-400 font-extrabold truncate">
                              {item.value} click{item.value !== 1 ? 's' : ''} ({percentage.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="w-full bg-purple-950/40 rounded-full h-2 overflow-hidden border border-purple-900/10">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Visits Table */}
          <Card className="border-purple-950/40 bg-purple-950/15 backdrop-blur-3xl shadow-xl shadow-black/20 rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-black text-white">Recent Visits</CardTitle>
              <CardDescription className="text-slate-400 text-sm font-medium">
                Detailed log of the last 10 visitor redirections
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.recentVisits.length === 0 ? (
                <div className="p-8 text-center text-sm font-bold text-slate-550">
                  No clicks registered on this short URL yet.
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-purple-950/35 border-b border-purple-950/40">
                    <TableRow className="border-purple-950/40 hover:bg-transparent">
                      <TableHead className="text-slate-400 text-xs font-bold tracking-wider uppercase py-4 pl-6">Visited At</TableHead>
                      <TableHead className="text-slate-400 text-xs font-bold tracking-wider uppercase py-4">Browser</TableHead>
                      <TableHead className="text-slate-400 text-xs font-bold tracking-wider uppercase py-4">Device</TableHead>
                      <TableHead className="text-slate-400 text-xs font-bold tracking-wider uppercase py-4 pr-6">Referrer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.recentVisits.map((visit) => (
                      <TableRow key={visit.id} className="border-purple-950/20 hover:bg-purple-950/10 transition-colors">
                        <TableCell className="py-4 pl-6 text-slate-300 font-bold text-sm">
                          {formatDate(visit.visitedAt)}
                        </TableCell>
                        <TableCell className="py-4 text-white text-sm font-bold">
                          <div className="flex items-center gap-2">
                            {getBrowserIcon(visit.browser)}
                            <span>{visit.browser}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-slate-400 text-xs font-extrabold uppercase tracking-widest">
                          {visit.device || 'Desktop'}
                        </TableCell>
                        <TableCell className="py-4 pr-6 text-slate-300 text-sm font-medium truncate max-w-[150px]">
                          {visit.referrer || 'Direct'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column (Right) */}
        <div className="lg:col-span-1 space-y-6">
          {/* QR Code Card */}
          <Card className="border-purple-950/40 bg-purple-950/15 backdrop-blur-3xl shadow-xl shadow-black/20 rounded-2xl overflow-hidden p-6 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4 w-full justify-center">
              <QrCode className="h-4 w-4 text-purple-400" />
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">QR Code</h3>
            </div>
            
            <div className="p-4 bg-white/5 border border-purple-900/20 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden mb-4">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code Link" className="h-40 w-40 object-contain" />
              ) : (
                <div className="h-40 w-40 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                </div>
              )}
            </div>

            {/* Foreground Color Picker */}
            <div className="w-full space-y-2 mb-4 text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">QR Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                  className="h-8 w-14 border border-purple-900/50 rounded cursor-pointer bg-transparent"
                />
                <span className="text-xs font-mono text-slate-300 font-bold uppercase">{qrColor}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full space-y-2">
              <Button
                onClick={() => downloadQR('png')}
                className="w-full h-10 bg-white text-black hover:bg-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <Download className="h-3.5 w-3.5" /> Download PNG
              </Button>
              <Button
                onClick={() => downloadQR('svg')}
                className="w-full h-10 bg-purple-900/40 border border-purple-800/30 hover:bg-purple-900/60 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <Download className="h-3.5 w-3.5" /> Download SVG
              </Button>
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card className="border-purple-950/40 bg-purple-950/15 backdrop-blur-3xl shadow-xl shadow-black/20 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Actions</h3>
            <div className="space-y-2">
              <Button
                onClick={handleCopy}
                variant="outline"
                className="w-full border-purple-900/20 bg-purple-950/25 hover:bg-purple-950/50 hover:text-white rounded-xl flex items-center justify-center gap-2 h-10 text-xs font-bold transition-all text-slate-300 animate-fade-in"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied!' : 'Copy Short Link'}
              </Button>
              
              <Button
                onClick={handleExportCsv}
                disabled={isExporting}
                className="w-full glow-btn-primary shadow-[0_0_15px_rgba(168,85,247,0.2)] rounded-xl flex items-center justify-center gap-2 h-10 text-xs font-bold transition-all cursor-pointer"
              >
                {isExporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileSpreadsheet className="h-3.5 w-3.5" />}
                Export Visit Log (CSV)
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
