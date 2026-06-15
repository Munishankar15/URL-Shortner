'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link2, LayoutDashboard, LogOut, Menu, X, User, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#05040a] text-white relative font-sans" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Cosmic Arc Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#05040a]">
        {/* Vertical Light Rays */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[35%] sm:h-[45%] flex justify-center items-end gap-2 sm:gap-6 opacity-70">
           <div className="w-[60px] h-3/4 bg-gradient-to-b from-transparent to-indigo-500/20 blur-[8px]" />
           <div className="w-[100px] h-full bg-gradient-to-b from-transparent to-violet-500/30 blur-[12px]" />
           <div className="w-[150px] h-[90%] bg-gradient-to-b from-transparent to-cyan-400/20 blur-[15px]" />
           <div className="w-[200px] h-full bg-gradient-to-b from-transparent to-violet-400/40 blur-[20px]" />
           <div className="w-[120px] h-[85%] bg-gradient-to-b from-transparent to-indigo-400/30 blur-[10px]" />
           <div className="w-[80px] h-3/4 bg-gradient-to-b from-transparent to-purple-500/20 blur-[12px]" />
        </div>

        {/* Ambient back-glow behind the arc */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-600/40 rounded-[100%] blur-[100px]" />
        
        {/* The Arc Horizon */}
        <div className="absolute top-[35%] sm:top-[45%] left-1/2 -translate-x-1/2 w-[150vw] sm:w-[1200px] h-[600px] rounded-[100%] bg-[#030208] border-t-[3px] border-t-white shadow-[0_-30px_100px_20px_rgba(124,58,237,0.8)] blur-[1px]" />
        <div className="absolute top-[35%] sm:top-[45%] left-1/2 -translate-x-1/2 w-[140vw] sm:w-[1100px] h-[550px] rounded-[100%] border-t-[8px] border-t-indigo-500 shadow-[0_-20px_80px_10px_rgba(99,102,241,0.6)] blur-[4px]" />
        
        {/* Bright cyan/violet crest glow directly on top of the arc */}
        <div className="absolute top-[34%] sm:top-[44%] left-1/2 -translate-x-1/2 w-[500px] h-[40px] bg-cyan-300/80 rounded-[100%] blur-[20px] animate-pulse" />
        <div className="absolute top-[33%] sm:top-[43%] left-1/2 -translate-x-1/2 w-[700px] h-[80px] bg-violet-400/60 rounded-[100%] blur-[40px]" />
      </div>

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-purple-950/40 bg-purple-950/15 backdrop-blur-3xl z-20 shadow-xl shadow-black/20">
        <div className="flex h-16 items-center px-6 border-b border-purple-950/40 gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.5)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
            </svg>
            <span className="text-xl font-extrabold tracking-tight text-white">
              ShortlyX
            </span>
          </Link>
        </div>
        
        <div className="flex flex-1 flex-col justify-between p-4">
          <nav className="space-y-2">
            <div className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Main Menu</div>
            <Button
              variant={pathname === '/dashboard' ? 'secondary' : 'ghost'}
              className={`w-full justify-start gap-3 rounded-xl transition-all duration-300 cursor-pointer font-bold text-sm h-12 shadow-sm ${
                pathname === '/dashboard'
                  ? 'bg-purple-950/30 text-purple-400 border border-purple-900/30 shadow-purple-950/20'
                  : 'text-slate-400 hover:text-white hover:bg-purple-950/20 border border-transparent shadow-none'
              }`}
              onClick={() => router.push('/dashboard')}
            >
              <LayoutDashboard className={`h-4.5 w-4.5 ${pathname === '/dashboard' ? 'text-purple-400' : 'text-slate-400'}`} />
              <span>Dashboard</span>
            </Button>

            <Button
              variant={pathname.startsWith('/dashboard/analytics') ? 'secondary' : 'ghost'}
              className={`w-full justify-start gap-3 rounded-xl transition-all duration-300 cursor-pointer font-bold text-sm h-12 shadow-sm ${
                pathname.startsWith('/dashboard/analytics')
                  ? 'bg-purple-950/30 text-purple-400 border border-purple-900/30 shadow-purple-950/20'
                  : 'text-slate-400 hover:text-white hover:bg-purple-950/20 border border-transparent shadow-none'
              }`}
              onClick={() => router.push('/dashboard/analytics')}
            >
              <BarChart3 className={`h-5 w-5 ${pathname.startsWith('/dashboard/analytics') ? 'text-purple-400' : 'text-slate-450'}`} />
              <span>Analytics Overview</span>
            </Button>


          </nav>

          <div className="border-t border-purple-950/40 pt-4 space-y-4">
            <div className="flex items-center gap-3 px-3 py-2 bg-purple-950/30 rounded-2xl border border-purple-900/20">
              <div className="h-10 w-10 rounded-full bg-purple-950/20 border border-purple-900/30 shadow-sm flex items-center justify-center text-purple-400 shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold truncate text-white">{user?.name}</span>
                <span className="text-xs font-medium text-slate-400 truncate">{user?.email}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start gap-3 text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 hover:border-rose-900/30 border border-transparent transition-all duration-300 rounded-xl font-bold h-12 cursor-pointer shadow-sm"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-purple-950/40 bg-[#08040d] p-4 transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center px-2 justify-between border-b border-purple-950/40">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
            </svg>
            <span className="text-xl font-extrabold text-white">ShortlyX</span>
          </div>
          <Button variant="ghost" size="icon" className="cursor-pointer text-slate-400 hover:bg-purple-950/20" onClick={() => setIsMobileOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col justify-between mt-6">
          <nav className="space-y-2">
            <Button
              variant={pathname === '/dashboard' ? 'secondary' : 'ghost'}
              className={`w-full justify-start gap-3 rounded-xl h-12 text-sm font-bold ${pathname === '/dashboard' ? 'bg-purple-950/30 text-purple-400' : 'text-slate-400'}`}
              onClick={() => {
                setIsMobileOpen(false);
                router.push('/dashboard');
              }}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Button>

            <Button
              variant={pathname.startsWith('/dashboard/analytics') ? 'secondary' : 'ghost'}
              className={`w-full justify-start gap-3 rounded-xl h-12 text-sm font-bold ${pathname.startsWith('/dashboard/analytics') ? 'bg-purple-950/30 text-purple-400' : 'text-slate-400'}`}
              onClick={() => {
                setIsMobileOpen(false);
                router.push('/dashboard/analytics');
              }}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Analytics Overview</span>
            </Button>


          </nav>

          <div className="border-t border-purple-950/40 pt-4 space-y-4">
            <div className="flex items-center gap-3 px-3 py-2 bg-purple-950/30 rounded-2xl border border-purple-900/10">
              <div className="h-10 w-10 rounded-full bg-purple-950/20 flex items-center justify-center text-purple-400 shadow-sm">
                <User className="h-5 w-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold truncate text-white">{user?.name}</span>
                <span className="text-xs font-medium text-slate-400 truncate">{user?.email}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                setIsMobileOpen(false);
                logout();
              }}
              className="w-full justify-start gap-3 text-slate-400 hover:bg-rose-950/20 hover:text-rose-450 rounded-xl font-bold h-12"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden relative z-10">
        {/* Header */}
        <header className="flex h-16 items-center justify-between px-6 border-b border-purple-950/40 bg-purple-950/5 backdrop-blur-3xl shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-350 cursor-pointer hover:bg-purple-950/20"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xs font-extrabold tracking-widest uppercase text-slate-500">Workspace</h1>
          </div>
          <div className="text-sm text-slate-400 font-medium bg-purple-950/15 px-4 py-2 rounded-full border border-purple-950/40 shadow-sm backdrop-blur-md">
            Welcome back, <span className="font-bold text-purple-400">{user?.name}</span>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-transparent">
          <div className="mx-auto max-w-6xl space-y-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
