'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link2, Globe, User, Mail, ExternalLink, Code2, Database, Layout, Server, ArrowRight, Play } from 'lucide-react';

export default function PortfolioPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#030305] text-slate-200 relative overflow-x-hidden selection:bg-violet-500 selection:text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Cosmic background with purple black-hole eclipse effect */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        {/* Deep background ambient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#110826] via-[#030305] to-[#030305]" />
        
        {/* The glowing purple ring / eclipse */}
        <div className="absolute top-[15%] sm:top-[25%] w-[120vw] sm:w-[800px] h-[300px] bg-transparent border-[4px] border-violet-400 rounded-[100%] shadow-[0_0_120px_50px_rgba(139,92,246,0.6),inset_0_0_80px_20px_rgba(168,85,247,0.5)] transform scale-y-[0.3] blur-[2px] opacity-90" />
        <div className="absolute top-[15%] sm:top-[25%] w-[120vw] sm:w-[800px] h-[300px] bg-transparent border-[2px] border-white rounded-[100%] shadow-[0_0_40px_10px_rgba(255,255,255,0.8)] transform scale-y-[0.3] blur-[1px] opacity-100" />
        
        {/* Top central intensive glow */}
        <div className="absolute top-[10%] sm:top-[20%] w-[600px] h-[400px] bg-violet-600/40 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-[15%] sm:top-[25%] w-[400px] h-[200px] bg-fuchsia-500/30 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/5 bg-black/10 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              <Code2 className="h-4 w-4" />
            </div>
            <span className="text-xl font-medium tracking-tight text-white">
              Portfolio
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
             <a href="#" className="hover:text-white transition-colors">Projects</a>
             <a href="#" className="hover:text-white transition-colors">Skills</a>
             <a href="#" className="hover:text-white transition-colors">Experience</a>
             <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden sm:flex text-slate-300 font-medium hover:bg-white/5 hover:text-white rounded-full px-6" onClick={() => router.push('/login')}>
              Login
            </Button>
            <Button className="bg-transparent border border-violet-500/50 hover:bg-violet-500/20 text-violet-100 shadow-[0_0_15px_rgba(139,92,246,0.2)] rounded-full px-6 font-medium transition-all cursor-pointer">
              Contact Me
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16 sm:py-24 space-y-32">
        {/* Hero Section */}
        <section className="flex flex-col items-center gap-12 animate-fade-in text-center pt-10">
          <div className="space-y-6 max-w-4xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium text-slate-300 mb-4 shadow-lg">
              <span className="text-violet-400">✨ Update:</span> Available for new freelance projects
            </div>
            <h1 className="text-5xl sm:text-7xl font-medium text-white tracking-tight leading-[1.1]">
              Build better with <span className="text-white">Me</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-2xl">
              Never compromise on a design, architecture, or user experience. I build full-stack digital experiences that scale.
            </p>
          </div>

          {/* Hero Mockup (Replacing the Workspace Image with a mockup similar to the Reflect video) */}
          <div className="w-full max-w-4xl relative mt-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/20 rounded-3xl blur-2xl transform rotate-1" />
            <div className="relative bg-[#0c0c11]/80 backdrop-blur-2xl border border-white/10 p-2 sm:p-4 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
               <div className="bg-[#111118] rounded-xl sm:rounded-2xl border border-white/10 overflow-hidden min-h-[400px] flex flex-col relative shadow-inner">
                  
                  {/* Mockup Header */}
                  <div className="h-12 border-b border-white/10 flex items-center px-4 gap-4 bg-white/5">
                     <div className="flex gap-1.5">
                       <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                       <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                       <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                     </div>
                     <div className="flex-1 flex justify-center">
                        <div className="h-6 w-64 bg-black/40 rounded-md border border-white/5 flex items-center px-3">
                          <span className="text-[10px] text-slate-500 font-medium">search or type command...</span>
                        </div>
                     </div>
                  </div>

                  {/* Mockup Body */}
                  <div className="flex flex-1 p-6 gap-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/10 to-transparent">
                     <div className="w-48 hidden sm:flex flex-col gap-4 border-r border-white/5 pr-6">
                        <div className="h-6 w-24 bg-violet-500/20 border border-violet-500/30 rounded flex items-center px-2">
                           <span className="text-[10px] text-violet-300 font-medium">Dashboard</span>
                        </div>
                        <div className="h-6 w-32 hover:bg-white/5 rounded flex items-center px-2">
                           <span className="text-[10px] text-slate-400 font-medium">Analytics</span>
                        </div>
                        <div className="h-6 w-20 hover:bg-white/5 rounded flex items-center px-2">
                           <span className="text-[10px] text-slate-400 font-medium">Settings</span>
                        </div>
                     </div>
                     <div className="flex-1 space-y-6">
                        <h3 className="text-lg font-medium text-white tracking-tight">Recent Activity</h3>
                        <div className="space-y-3">
                           <div className="h-16 w-full bg-white/5 border border-white/5 rounded-lg flex items-center p-4 gap-4">
                              <div className="h-8 w-8 rounded-full bg-violet-500/20 border border-violet-500/30" />
                              <div className="space-y-2 flex-1">
                                <div className="h-2 w-1/3 bg-slate-300/80 rounded" />
                                <div className="h-2 w-1/4 bg-slate-500/50 rounded" />
                              </div>
                           </div>
                           <div className="h-16 w-full bg-white/5 border border-white/5 rounded-lg flex items-center p-4 gap-4">
                              <div className="h-8 w-8 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/30" />
                              <div className="space-y-2 flex-1">
                                <div className="h-2 w-1/2 bg-slate-300/80 rounded" />
                                <div className="h-2 w-1/5 bg-slate-500/50 rounded" />
                              </div>
                           </div>
                           <div className="h-16 w-full bg-white/5 border border-white/5 rounded-lg flex items-center p-4 gap-4 opacity-50">
                              <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
                              <div className="space-y-2 flex-1">
                                <div className="h-2 w-1/4 bg-slate-300/80 rounded" />
                                <div className="h-2 w-1/3 bg-slate-500/50 rounded" />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  {/* Play Button overlay representing the video in the image */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                     <div className="h-16 w-16 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,255,255,0.1)] cursor-pointer hover:bg-white/20 transition-all hover:scale-110">
                        <Play className="h-6 w-6 ml-1" />
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-medium text-white tracking-tight">Technical Arsenal</h2>
            <p className="text-slate-400 font-medium max-w-2xl mx-auto">
              A comprehensive toolkit for building modern, scalable web applications from the ground up.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Frontend", icon: Layout, desc: "React, Next.js, Tailwind CSS, TypeScript" },
              { title: "Backend", icon: Server, desc: "Node.js, NestJS, Express, REST APIs" },
              { title: "Database", icon: Database, desc: "PostgreSQL, Prisma, MongoDB, Redis" },
              { title: "DevOps", icon: Code2, desc: "Docker, AWS, CI/CD, Git, Linux" },
            ].map((skill, i) => (
              <Card key={i} className="border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-xl shadow-black/50 rounded-2xl hover:bg-white/[0.04] transition-all duration-300">
                <CardContent className="p-8 space-y-6">
                  <div className={`h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]`}>
                    <skill.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-white">{skill.title}</h3>
                    <p className="text-sm font-medium text-slate-400 leading-relaxed">{skill.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="space-y-12">
          <div className="space-y-4 text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl font-medium text-white tracking-tight">Featured Projects</h2>
            <p className="text-slate-400 font-medium max-w-2xl">
              Showcasing recent work that demonstrates architecture, design, and problem-solving.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Project 1: URL Shortener */}
            <Card className="border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-2xl shadow-black/50 rounded-3xl overflow-hidden group hover:border-violet-500/30 transition-all duration-300 flex flex-col">
              <div className="h-64 bg-[#0a0a0f] p-8 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 to-[#0a0a0f] opacity-80" />
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-500 via-transparent to-transparent" />
                
                {/* Mockup UI visual inside card */}
                <div className="relative w-full max-w-sm bg-[#13131a] rounded-xl shadow-2xl overflow-hidden border border-white/10 transform group-hover:scale-105 transition-transform duration-500">
                  <div className="h-8 border-b border-white/5 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                       <div className="h-6 w-6 rounded bg-violet-600 flex items-center justify-center text-white"><Link2 className="h-3 w-3" /></div>
                       <div className="h-4 w-24 bg-white/10 rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-10 bg-white/5 border border-white/5 rounded-lg flex items-center px-3 gap-2">
                        <div className="h-3 w-3/4 bg-white/10 rounded" />
                      </div>
                      <div className="h-10 bg-violet-600 rounded-lg shadow-[0_0_10px_rgba(139,92,246,0.3)]" />
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  <div className="flex gap-2">
                    <span className="text-[10px] font-medium px-2 py-1 bg-white/5 text-slate-300 rounded uppercase tracking-wider border border-white/5">Next.js</span>
                    <span className="text-[10px] font-medium px-2 py-1 bg-white/5 text-slate-300 rounded uppercase tracking-wider border border-white/5">NestJS</span>
                    <span className="text-[10px] font-medium px-2 py-1 bg-white/5 text-slate-300 rounded uppercase tracking-wider border border-white/5">PostgreSQL</span>
                  </div>
                  <h3 className="text-2xl font-medium text-white">ShortlyX - Advanced URL Shortener</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    A full-stack URL shortening platform featuring JWT authentication, real-time analytics with charts, device/browser tracking, and an elegant dashboard interface.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-4">
                  <Button onClick={() => router.push('/')} className="bg-white text-black hover:bg-slate-200 rounded-full font-medium cursor-pointer">
                    Live Demo <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5 font-medium rounded-full cursor-pointer">
                    View Code <Globe className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Project 2: Placeholder */}
            <Card className="border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-2xl shadow-black/50 rounded-3xl overflow-hidden group hover:border-violet-500/30 transition-all duration-300 flex flex-col">
              <div className="h-64 bg-[#0a0a0f] p-8 flex items-center justify-center relative overflow-hidden">
                 <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=500" 
                  alt="E-commerce Analytics" 
                  className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
              </div>
              <CardContent className="p-8 flex-1 flex flex-col relative z-10 bg-transparent">
                <div className="space-y-4 flex-1">
                  <div className="flex gap-2">
                    <span className="text-[10px] font-medium px-2 py-1 bg-white/5 text-slate-300 rounded uppercase tracking-wider border border-white/5">React</span>
                    <span className="text-[10px] font-medium px-2 py-1 bg-white/5 text-slate-300 rounded uppercase tracking-wider border border-white/5">Redux</span>
                    <span className="text-[10px] font-medium px-2 py-1 bg-white/5 text-slate-300 rounded uppercase tracking-wider border border-white/5">Stripe</span>
                  </div>
                  <h3 className="text-2xl font-medium text-white">E-Commerce Platform</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    A modern storefront with comprehensive cart management, secure checkout via Stripe, inventory tracking, and dynamic product filtering.
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-4">
                  <Button variant="outline" className="border-white/10 text-slate-300 hover:text-white hover:bg-white/5 font-medium rounded-full cursor-pointer">
                    View Project <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pb-24">
          <div className="bg-[#0c0c11] border border-white/5 rounded-3xl p-10 sm:p-16 relative overflow-hidden shadow-2xl shadow-black/50">
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px]" />
            <div className="relative z-10 text-center space-y-8 max-w-2xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-medium text-white tracking-tight">Ready to build something amazing?</h2>
              <p className="text-lg text-slate-400 font-medium">
                I'm currently available for freelance opportunities or full-time roles. If you have a project that needs some creative magic, I'd love to hear about it.
              </p>
              <Button className="bg-violet-600 hover:bg-violet-500 text-white rounded-full h-14 px-10 font-medium text-lg shadow-[0_0_20px_rgba(139,92,246,0.4)] cursor-pointer">
                Say Hello <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/5 bg-black/20 backdrop-blur-md py-8 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 font-medium text-sm">© {new Date().getFullYear()} Reflect Portfolio. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-white font-medium text-sm transition-colors">Twitter</a>
            <a href="#" className="text-slate-400 hover:text-white font-medium text-sm transition-colors">LinkedIn</a>
            <a href="#" className="text-slate-400 hover:text-white font-medium text-sm transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
