'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { urlService, foldersService, getShortUrl } from '../services/api';
import { Url } from '../types';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Copy,
  ExternalLink,
  Trash2,
  BarChart3,
  Search,
  Check,
  Link2,
  QrCode,
  Upload,
  Download,
  Folder,
  Tag,
  Loader2,
  X,
  FileSpreadsheet
} from 'lucide-react';
import QRCode from 'qrcode';

interface UrlTableProps {
  onViewAnalytics: (urlId: string) => void;
}

export function UrlTable({ onViewAnalytics }: UrlTableProps) {
  const queryClient = useQueryClient();
  
  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState('all');
  const [selectedTag, setSelectedTag] = useState('');
  
  // Clipboard copied ID state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Modals & Target States
  const [deleteTarget, setDeleteTarget] = useState<Url | null>(null);
  const [qrTarget, setQrTarget] = useState<Url | null>(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);

  // Folders list for filters
  const [folders, setFolders] = useState<any[]>([]);

  // QR Customization States
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrColor, setQrColor] = useState('#a855f7'); // default purple

  // Bulk Shortening States
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Fetch folders for filter dropdown
  useEffect(() => {
    foldersService.listFolders().then(data => setFolders(data)).catch(() => {});
  }, []);

  // Fetch URLs with TanStack Query
  const { data: urls = [], isLoading, error } = useQuery({
    queryKey: ['urls', searchTerm, selectedFolderId, selectedTag],
    queryFn: () => urlService.listUrls(
      searchTerm, 
      selectedFolderId === 'all' ? undefined : selectedFolderId, 
      selectedTag.trim() || undefined
    ),
  });

  // Generate QR code data URL whenever target or color changes
  useEffect(() => {
    if (qrTarget) {
      QRCode.toDataURL(getShortUrl(qrTarget.shortCode), {
        color: {
          dark: qrColor,
          light: '#00000000', // transparent
        },
        width: 320,
        margin: 2,
      })
        .then(url => setQrCodeUrl(url))
        .catch(() => toast.error('Failed to generate QR Code'));
    } else {
      setQrCodeUrl('');
    }
  }, [qrTarget, qrColor]);

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => urlService.deleteUrl(id),
    onSuccess: () => {
      toast.success('Link deleted successfully');
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['urls'] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Failed to delete URL';
      toast.error(msg);
    },
  });

  const handleCopy = (url: Url) => {
    navigator.clipboard.writeText(getShortUrl(url.shortCode));
    setCopiedId(url.id);
    toast.success('Short link copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id);
    }
  };

  // Export QR code files
  const downloadQR = async (format: 'png' | 'svg') => {
    if (!qrTarget) return;

    try {
      const filename = `shortlyx-qr-${qrTarget.shortCode}.${format}`;

      if (format === 'png') {
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('PNG QR Code downloaded!');
      } else {
        // Generate SVG string
        const svgString = await QRCode.toString(getShortUrl(qrTarget.shortCode), {
          type: 'svg',
          color: {
            dark: qrColor,
            light: '#00000000',
          },
        });
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('SVG QR Code downloaded!');
      }
    } catch {
      toast.error('Failed to download QR code');
    }
  };

  // Bulk URL File Upload Handler
  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkFile) {
      toast.error('Please select a CSV file');
      return;
    }

    setIsBulkProcessing(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const csvText = event.target?.result as string;
      try {
        const resultCsv = await urlService.bulkShorten(
          csvText,
          selectedFolderId === 'all' ? undefined : selectedFolderId,
          selectedTag ? [selectedTag] : undefined
        );

        // Download processed CSV
        const blob = new Blob([resultCsv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'shortlyx-bulk-results.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success('Bulk URLs processed successfully! Results downloaded.');
        setBulkModalOpen(false);
        setBulkFile(null);
        queryClient.invalidateQueries({ queryKey: ['urls'] });
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to process bulk URLs');
      } finally {
        setIsBulkProcessing(false);
      }
    };
    reader.readAsText(bulkFile);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Helper to get url status
  const getUrlStatus = (url: Url) => {
    if (url.expiresAt && new Date() > new Date(url.expiresAt)) {
      return { label: 'Expired', style: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
    }
    if (url.maxClicks && url.clickCount >= url.maxClicks) {
      return { label: 'Limit Reached', style: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    }
    return { label: 'Active', style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
  };

  return (
    <div className="space-y-5 select-none text-left">
      
      {/* Filtering Header Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        
        {/* Search, Folder & Tag filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1 items-stretch sm:items-center max-w-2xl">
          <div className="relative flex items-center flex-1 group">
            <Search className="absolute left-3.5 h-4.5 w-4.5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
            <Input
              type="text"
              placeholder="Search links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 border-purple-950/40 bg-purple-950/10 text-white placeholder:text-slate-600 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 rounded-xl h-11 transition-all text-xs w-full font-medium"
            />
          </div>

          <div className="flex items-center gap-2.5">
            {/* Folder Filter */}
            <div className="relative flex items-center">
              <Folder className="absolute left-3 h-4 w-4 text-purple-400 pointer-events-none" />
              <select
                value={selectedFolderId}
                onChange={(e) => setSelectedFolderId(e.target.value)}
                className="h-11 pl-9 pr-6 rounded-xl border border-purple-950/45 bg-[#08040d] text-xs font-semibold text-slate-300 focus:border-purple-500/50 outline-none transition-all cursor-pointer"
              >
                <option value="all">All Folders</option>
                {folders.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div className="relative flex items-center">
              <Tag className="absolute left-3.5 h-4 w-4 text-purple-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Filter tag..."
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="h-11 pl-9 pr-4 rounded-xl border-purple-950/45 bg-purple-950/10 text-xs text-white placeholder:text-slate-650 focus:border-purple-500/50 w-32 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Bulk Upload Button */}
        <Button
          onClick={() => setBulkModalOpen(true)}
          className="h-11 rounded-xl bg-purple-900/20 hover:bg-purple-900/40 text-purple-350 border border-purple-900/30 text-xs font-bold transition-all px-4 cursor-pointer shadow-md shrink-0 flex items-center justify-center gap-2"
        >
          <Upload className="h-4 w-4" /> Bulk Shorten
        </Button>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-purple-950/40 bg-purple-950/15 backdrop-blur-3xl overflow-hidden shadow-xl shadow-black/20">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-full bg-purple-950/20" />
            <Skeleton className="h-12 w-full bg-purple-950/20" />
            <Skeleton className="h-12 w-full bg-purple-950/20" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-450 font-bold text-sm bg-rose-950/10">
            Failed to load links. Please refresh the page.
          </div>
        ) : urls.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-purple-950/20 border border-purple-900/30 flex items-center justify-center text-purple-400 shadow-sm">
              <Link2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-white text-lg">No links found</h3>
              <p className="text-sm text-slate-550 max-w-xs leading-relaxed font-semibold">
                No active shortened links match the current query filter settings.
              </p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-purple-950/35 border-b border-purple-950/40">
              <TableRow className="border-purple-950/40 hover:bg-transparent">
                <TableHead className="text-slate-400 text-xs font-bold tracking-wider uppercase py-4 pl-6">Original URL</TableHead>
                <TableHead className="text-slate-400 text-xs font-bold tracking-wider uppercase py-4">Short URL</TableHead>
                <TableHead className="text-slate-400 text-xs font-bold tracking-wider uppercase py-4">Status</TableHead>
                <TableHead className="text-slate-400 text-xs font-bold tracking-wider uppercase py-4">Created Date</TableHead>
                <TableHead className="text-slate-400 text-xs font-bold tracking-wider uppercase py-4 text-center">Clicks</TableHead>
                <TableHead className="text-slate-400 text-xs font-bold tracking-wider uppercase py-4 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {urls.map((url) => {
                const status = getUrlStatus(url);
                return (
                  <TableRow key={url.id} className="border-purple-950/20 hover:bg-purple-950/10 transition-colors">
                    {/* Original URL */}
                    <TableCell className="font-semibold py-4 pl-6 max-w-[240px]">
                      <div className="flex flex-col space-y-1 min-w-0">
                        <span className="truncate text-slate-300 text-sm font-bold cursor-default" title={url.originalUrl}>
                          {url.originalUrl}
                        </span>
                        {/* Tags list display */}
                        {url.tags && url.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {url.tags.map(t => (
                              <span key={t} className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-purple-900/30 text-purple-400 border border-purple-900/20">{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Short URL */}
                    <TableCell className="py-4 font-mono text-sm">
                      <a
                        href={getShortUrl(url.shortCode)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 transition-colors font-bold bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-900/30 cursor-pointer"
                      >
                        {getShortUrl(url.shortCode)}
                      </a>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="py-4">
                      <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.style}`}>
                        {status.label}
                      </span>
                    </TableCell>

                    {/* Created Date */}
                    <TableCell className="py-4 text-slate-450 text-xs font-bold">
                      {formatDate(url.createdAt)}
                    </TableCell>

                    {/* Click Count / Progress cap */}
                    <TableCell className="py-4 text-center max-w-[120px]">
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <span className="text-xs font-extrabold text-slate-350 bg-purple-950/30 border border-purple-900/20 px-2 py-0.5 rounded-md">
                          {url.maxClicks ? `${url.clickCount} / ${url.maxClicks}` : url.clickCount}
                        </span>
                        {url.maxClicks && (
                          <div className="w-16 h-1 bg-purple-950 border border-purple-900/10 rounded-full overflow-hidden shrink-0">
                            <div 
                              className="bg-purple-500 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${Math.min((url.clickCount / url.maxClicks) * 100, 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Action buttons */}
                    <TableCell className="py-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopy(url)}
                          className="h-8 w-8 text-slate-450 hover:text-white hover:bg-purple-950/20 rounded-lg cursor-pointer"
                          title="Copy Link"
                        >
                          {copiedId === url.id ? <Check className="h-4 w-4 text-purple-400" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setQrTarget(url)}
                          className="h-8 w-8 text-slate-450 hover:text-white hover:bg-purple-950/20 rounded-lg cursor-pointer"
                          title="View QR Code"
                        >
                          <QrCode className="h-4.5 w-4.5" />
                        </Button>
                        <a
                          href={getShortUrl(url.shortCode)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 w-8 inline-flex items-center justify-center text-slate-450 hover:text-white hover:bg-purple-950/20 rounded-lg cursor-pointer transition-colors"
                          title="Open Link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewAnalytics(url.id)}
                          className="h-8 w-8 text-purple-400 hover:text-purple-300 hover:bg-purple-950/20 rounded-lg cursor-pointer"
                          title="View Analytics"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(url)}
                          className="h-8 w-8 text-rose-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg cursor-pointer"
                          title="Delete Link"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* QR Code Dialog Modal */}
      <Dialog open={!!qrTarget} onOpenChange={(open) => !open && setQrTarget(null)}>
        <DialogContent className="border-purple-950/40 bg-[#08040d] text-white max-w-sm rounded-3xl shadow-2xl flex flex-col items-center p-8">
          <DialogHeader className="w-full text-center space-y-1">
            <DialogTitle className="text-xl font-black text-white">QR Code Generator</DialogTitle>
            <DialogDescription className="text-xs text-slate-450">
              Scan or download the QR code for alias: <span className="font-mono text-purple-400 font-bold bg-purple-950/40 px-1 rounded">{qrTarget?.shortCode}</span>
            </DialogDescription>
          </DialogHeader>

          {/* QR Code Preview */}
          <div className="my-6 p-4 bg-white/5 border border-purple-900/20 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="QR Code Link" className="h-44 w-44 object-contain" />
            ) : (
              <div className="h-44 w-44 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-purple-500" /></div>
            )}
          </div>

          {/* Foreground Color Picker */}
          <div className="w-full space-y-2 mb-6 text-left">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customize QR Code Color</label>
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
          <div className="w-full grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => downloadQR('png')}
              className="h-11 bg-white text-black hover:bg-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
            >
              <Download className="h-3.5 w-3.5" /> Download PNG
            </button>
            <button
              onClick={() => downloadQR('svg')}
              className="h-11 bg-purple-900/40 border border-purple-800/30 hover:bg-purple-900/60 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Download className="h-3.5 w-3.5" /> Download SVG
            </button>
          </div>
          
          <button
            onClick={() => setQrTarget(null)}
            className="text-xs font-semibold text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Modal */}
      <Dialog open={bulkModalOpen} onOpenChange={(open) => !open && setBulkModalOpen(false)}>
        <DialogContent className="border-purple-950/40 bg-[#08040d] text-white max-w-md rounded-3xl p-6 shadow-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-black text-white flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-purple-400" /> Bulk URL Shortener
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Upload a CSV file containing a single column of URLs to shorten them in bulk.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBulkUpload} className="space-y-5 mt-4">
            <div className="p-6 border-2 border-dashed border-purple-900/30 rounded-2xl bg-purple-950/5 text-center space-y-4 hover:border-purple-500/30 transition-colors flex flex-col items-center">
              <Upload className="h-8 w-8 text-purple-400 animate-bounce" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-white">Select your CSV File</p>
                <p className="text-[10px] text-slate-500">File should contain raw URLs separated by newlines.</p>
              </div>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => setBulkFile(e.target.files ? e.target.files[0] : null)}
                className="w-full text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-purple-900/20 file:text-purple-400 file:cursor-pointer hover:file:bg-purple-900/35"
                disabled={isBulkProcessing}
              />
              {bulkFile && (
                <span className="text-xs text-purple-400 font-bold mt-2 truncate max-w-full">
                  Selected: {bulkFile.name}
                </span>
              )}
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setBulkModalOpen(false);
                  setBulkFile(null);
                }}
                className="text-slate-400 hover:text-white rounded-xl font-bold cursor-pointer"
                disabled={isBulkProcessing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isBulkProcessing || !bulkFile}
                className="bg-white text-black hover:bg-slate-200 font-bold rounded-xl px-5 h-10 cursor-pointer shadow-sm transition-all"
              >
                {isBulkProcessing ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                ) : (
                  'Process File'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Deletion */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="border-purple-950/40 bg-[#08040d] text-white max-w-sm rounded-2xl shadow-2xl">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-black text-white tracking-tight">Delete shortened URL?</DialogTitle>
            <DialogDescription className="text-slate-450 text-sm leading-relaxed font-medium">
              This action cannot be undone. This will permanently delete the short link{' '}
              <span className="font-mono text-purple-400 font-bold bg-purple-950/40 px-1 rounded">"{deleteTarget?.shortCode}"</span> and wipe all associated click history.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex flex-row gap-2 justify-end">
            <Button
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
              className="text-slate-400 hover:bg-purple-950/20 hover:text-white rounded-xl font-bold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              disabled={deleteMutation.isPending}
              onClick={handleDeleteConfirm}
              className="bg-rose-650 hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/15 text-white rounded-xl font-bold cursor-pointer transition-all"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
