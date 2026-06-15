export default function Footer() {
  return (
    <footer className="bg-white py-12 border-t border-zinc-200">
      <div className="max-w-5xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded flex items-center justify-center bg-zinc-900 text-white font-bold text-xs tracking-tighter">
            JD
          </div>
          <span className="text-sm font-bold text-zinc-900 tracking-tight">John Doe</span>
        </div>
        
        <p className="text-zinc-500 text-xs font-medium text-center md:text-left">
          © {new Date().getFullYear()} John Doe. All rights reserved.
        </p>
        
        <div className="flex items-center gap-6 text-sm font-medium text-zinc-500">
          <a href="#home" className="hover:text-zinc-900 transition-colors">Home</a>
          <a href="#about" className="hover:text-zinc-900 transition-colors">About</a>
          <a href="#projects" className="hover:text-zinc-900 transition-colors">Work</a>
        </div>
      </div>
    </footer>
  );
}
