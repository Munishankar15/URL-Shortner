import { ArrowRight, Mail } from 'lucide-react';
import { Github, Linkedin } from './icons';

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex flex-col justify-center pt-20 bg-white selection:bg-zinc-200 selection:text-zinc-900">
      <div className="max-w-5xl mx-auto px-6 md:px-8 w-full flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-medium tracking-wide mb-8 hover:bg-zinc-200 transition-colors cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-500"></span>
          </span>
          Open to new roles
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-zinc-900 tracking-tighter leading-[1.05] mb-6 max-w-4xl">
          Full Stack <br className="hidden sm:block" />
          <span className="text-zinc-400">Developer.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl leading-relaxed font-medium mb-10">
          I build clean, scalable, and user-centric web applications. Focused on minimalist design and robust architecture.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a href="#projects" className="w-full sm:w-auto px-6 py-3 rounded-md bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 group active:scale-95 shadow-sm">
            View Work <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a href="#contact" className="w-full sm:w-auto px-6 py-3 rounded-md bg-white text-zinc-900 font-medium border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm">
            Get in touch
          </a>
        </div>
        
        <div className="flex items-center gap-6 mt-16 text-zinc-400">
          <a href="#" className="hover:text-zinc-900 transition-colors"><Github className="h-5 w-5" /></a>
          <a href="#" className="hover:text-zinc-900 transition-colors"><Linkedin className="h-5 w-5" /></a>
          <a href="#" className="hover:text-zinc-900 transition-colors"><Mail className="h-5 w-5" /></a>
        </div>

      </div>
    </section>
  );
}
