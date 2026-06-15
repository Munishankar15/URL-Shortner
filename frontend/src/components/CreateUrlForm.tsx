'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { urlService, foldersService } from '../services/api';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Link2, 
  Loader2, 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  Calendar, 
  Activity, 
  Image, 
  FolderPlus, 
  Tag, 
  CheckCircle2, 
  XCircle,
  FileText 
} from 'lucide-react';

export function CreateUrlForm() {
  const queryClient = useQueryClient();

  // Basic States
  const [originalUrl, setOriginalUrl] = useState('');
  const [inputType, setInputType] = useState<'url' | 'text'>('url');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced Options States
  const [customAlias, setCustomAlias] = useState('');
  const [aliasStatus, setAliasStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  
  const [expiresAt, setExpiresAt] = useState('');
  const [password, setPassword] = useState('');
  const [maxClicks, setMaxClicks] = useState<number | ''>('');
  
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  
  const [folders, setFolders] = useState<any[]>([]);
  const [folderId, setFolderId] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  // Debounced Custom Alias Verification
  useEffect(() => {
    if (!customAlias) {
      setAliasStatus('idle');
      return;
    }

    const regex = /^[a-zA-Z0-9_-]+$/;
    if (!regex.test(customAlias)) {
      setAliasStatus('invalid');
      return;
    }

    setAliasStatus('checking');
    const delayDebounce = setTimeout(async () => {
      try {
        const available = await urlService.checkAlias(customAlias);
        setAliasStatus(available ? 'available' : 'taken');
      } catch {
        setAliasStatus('idle');
      }
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [customAlias]);

  // Load folders
  useEffect(() => {
    foldersService.listFolders()
      .then(res => setFolders(res))
      .catch(() => {});
  }, []);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const folder = await foldersService.createFolder(newFolderName.trim());
      setFolders(prev => [...prev, folder]);
      setFolderId(folder.id);
      setNewFolderName('');
      setShowNewFolderInput(false);
      toast.success('Folder created successfully');
    } catch {
      toast.error('Failed to create folder');
    }
  };

  const mutation = useMutation({
    mutationFn: () => {
      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      return urlService.createUrl({
        originalUrl,
        customAlias: customAlias.trim() || undefined,
        expiresAt: expiresAt || undefined,
        password: password || undefined,
        maxClicks: maxClicks ? Number(maxClicks) : undefined,
        ogTitle: ogTitle.trim() || undefined,
        ogDescription: ogDescription.trim() || undefined,
        ogImage: ogImage.trim() || undefined,
        folderId: folderId || undefined,
        tags: tags.length > 0 ? tags : undefined,
      });
    },
    onSuccess: (newUrl) => {
      toast.success(
        <div className="flex flex-col gap-1 text-left">
          <span className="font-bold text-green-400">Shortened successfully!</span>
          <span className="text-xs text-slate-300 font-mono truncate">{newUrl.shortUrl}</span>
        </div>
      );
      // Reset form
      setOriginalUrl('');
      setCustomAlias('');
      setExpiresAt('');
      setPassword('');
      setMaxClicks('');
      setOgTitle('');
      setOgDescription('');
      setOgImage('');
      setFolderId('');
      setTagsInput('');
      setAliasStatus('idle');
      setShowAdvanced(false);

      queryClient.invalidateQueries({ queryKey: ['urls'] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Failed to shorten URL.';
      toast.error(msg);
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl) {
      toast.error(inputType === 'url' ? 'Please enter a destination URL' : 'Please enter some text or file content');
      return;
    }
    if (customAlias && aliasStatus !== 'available') {
      toast.error('Please choose a valid and available custom alias');
      return;
    }
    mutation.mutate();
  };

  return (
    <Card className="border-purple-950/40 bg-purple-950/15 backdrop-blur-3xl shadow-xl shadow-black/20 rounded-2xl overflow-hidden hover:border-purple-500/10 transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-black text-white flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/10">
            <Link2 className="h-5 w-5" />
          </div>
          Shorten a Long Link
        </CardTitle>
        <CardDescription className="text-slate-400 text-sm font-medium">
          Create custom, secure, high-speed shortened links with clicks analytics.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Toggle Inputs */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => {
              setInputType('url');
              setOriginalUrl('');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              inputType === 'url'
                ? 'bg-purple-900/40 text-purple-300 border border-purple-800/30'
                : 'text-slate-400 hover:text-white bg-transparent border border-transparent'
            }`}
          >
            <Link2 className="h-3.5 w-3.5" />
            <span>Shorten URL</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setInputType('text');
              setOriginalUrl('');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              inputType === 'text'
                ? 'bg-purple-900/40 text-purple-300 border border-purple-800/30'
                : 'text-slate-400 hover:text-white bg-transparent border border-transparent'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Paste Text / File</span>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Dynamic input box */}
          {inputType === 'url' ? (
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex-grow w-full">
                <Input
                  type="text"
                  placeholder="https://example.com/very-long-destination-url-path"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="border-purple-900/50 bg-purple-950/20 text-white placeholder:text-slate-650 focus:border-purple-500/50 focus:bg-purple-950/30 focus:ring-4 focus:ring-purple-500/10 rounded-xl h-12 w-full transition-all text-sm font-medium shadow-sm"
                  disabled={mutation.isPending}
                />
              </div>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="glow-btn-primary rounded-xl h-12 px-6 font-bold text-sm transition-all shrink-0 w-full sm:w-auto cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.2)]"
              >
                {mutation.isPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Shortening...</>
                ) : (
                  'Shorten Link'
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                placeholder="Paste text, code, or file content here... Visiting the shortened URL will open this content directly like a file."
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className="border border-purple-900/50 bg-purple-950/20 text-white placeholder:text-slate-650 focus:border-purple-500/50 focus:bg-purple-950/30 focus:ring-4 focus:ring-purple-500/10 rounded-xl p-3 w-full transition-all text-sm font-medium shadow-sm resize-none custom-scrollbar outline-none"
                rows={5}
                disabled={mutation.isPending}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="glow-btn-primary rounded-xl h-12 px-6 font-bold text-sm transition-all shrink-0 w-full sm:w-auto cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                >
                  {mutation.isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Shortening...</>
                  ) : (
                    'Shorten Text'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Advanced Trigger */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-455 hover:text-purple-300 transition-colors cursor-pointer"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>{showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}</span>
              {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>

          {/* Collapsible Advanced Form */}
          {showAdvanced && (
            <div className="pt-4 border-t border-purple-950/40 grid sm:grid-cols-2 gap-5 animate-fade-in text-left">
              
              {/* Custom Alias */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Custom Alias</label>
                  
                  {/* Alias availability check states */}
                  {aliasStatus === 'checking' && (
                    <span className="text-[10px] font-bold text-purple-400 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> checking...</span>
                  )}
                  {aliasStatus === 'available' && (
                    <span className="text-[10px] font-bold text-emerald-450 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-450" /> available</span>
                  )}
                  {aliasStatus === 'taken' && (
                    <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1"><XCircle className="h-3.5 w-3.5 text-rose-500" /> already taken</span>
                  )}
                  {aliasStatus === 'invalid' && (
                    <span className="text-[10px] font-bold text-rose-400">invalid format</span>
                  )}
                </div>
                <Input
                  type="text"
                  placeholder="e.g. promo-code-2026"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  className="border-purple-900/50 bg-purple-950/10 text-white placeholder:text-slate-650 focus:border-purple-500/50 rounded-xl h-11 transition-all text-sm font-medium"
                />
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed pl-1">
                  Only letters, numbers, hyphens, and underscores allowed.
                </p>
              </div>

              {/* Password Protection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-purple-400" /> Password Protection
                </label>
                <Input
                  type="password"
                  placeholder="Set password (optional)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-purple-900/50 bg-purple-950/10 text-white placeholder:text-slate-650 focus:border-purple-500/50 rounded-xl h-11 transition-all text-sm font-medium"
                />
              </div>

              {/* Expiry Date */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-purple-400" /> Expiry Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-purple-900/50 bg-purple-950/10 text-white focus:border-purple-500/50 outline-none text-sm font-medium transition-all"
                />
              </div>

              {/* Click Limit */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-purple-400" /> Click Limit Cap
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 100 max clicks"
                  value={maxClicks}
                  onChange={(e) => setMaxClicks(e.target.value ? parseInt(e.target.value, 10) : '')}
                  className="border-purple-900/50 bg-purple-950/10 text-white placeholder:text-slate-650 focus:border-purple-500/50 rounded-xl h-11 transition-all text-sm font-medium"
                  min="1"
                />
              </div>

              {/* Folders & Tags */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Folder</label>
                  <button
                    onClick={handleCreateFolder}
                    className="text-[10px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                  >
                    <FolderPlus className="h-3.5 w-3.5" /> create folder
                  </button>
                </div>
                <select
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-purple-900/50 bg-[#08040d] text-white focus:border-purple-500/50 outline-none text-sm font-medium transition-all"
                >
                  <option value="">No Folder</option>
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-purple-400" /> Tags
                </label>
                <Input
                  type="text"
                  placeholder="comma-separated, e.g. promo, social"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="border-purple-900/50 bg-purple-950/10 text-white placeholder:text-slate-650 focus:border-purple-500/50 rounded-xl h-11 transition-all text-sm font-medium"
                />
              </div>

              {/* Open Graph Tags header */}
              <div className="sm:col-span-2 pt-2 border-t border-purple-950/20">
                <h4 className="text-xs font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Image className="h-3.5 w-3.5" /> Social Link Preview Customization (Open Graph)
                </h4>
              </div>

              {/* OG Title */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preview Title</label>
                <Input
                  type="text"
                  placeholder="Custom preview title"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  className="border-purple-900/50 bg-purple-950/10 text-white placeholder:text-slate-650 focus:border-purple-500/50 rounded-xl h-11 transition-all text-sm font-medium"
                />
              </div>

              {/* OG Image */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preview Image URL</label>
                <Input
                  type="text"
                  placeholder="https://example.com/banner.png"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  className="border-purple-900/50 bg-purple-950/10 text-white placeholder:text-slate-650 focus:border-purple-500/50 rounded-xl h-11 transition-all text-sm font-medium"
                />
              </div>

              {/* OG Description */}
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preview Description</label>
                <Input
                  type="text"
                  placeholder="Custom link preview description details..."
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  className="border-purple-900/50 bg-purple-950/10 text-white placeholder:text-slate-650 focus:border-purple-500/50 rounded-xl h-11 transition-all text-sm font-medium"
                />
              </div>

            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
