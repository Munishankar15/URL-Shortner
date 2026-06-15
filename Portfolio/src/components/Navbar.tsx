import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-zinc-200/50 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-5xl mx-auto px-6 md:px-8 flex justify-between items-center">
        <a href="#home" onClick={(e) => scrollToSection(e, '#home')} className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white transition-transform group-hover:scale-105">
            <span className="font-bold text-sm tracking-tighter">JD</span>
          </div>
          <span className="text-lg font-semibold text-zinc-900 tracking-tight">John Doe</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="px-4 py-2 rounded-md bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-all active:scale-95">
            Get in touch
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-zinc-900 p-2 -mr-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div className={`absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-zinc-200 overflow-hidden transition-all duration-300 ease-in-out md:hidden ${isOpen ? 'max-h-64 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'}`}>
        <div className="flex flex-col px-6 gap-2">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-base font-medium text-zinc-600 hover:text-zinc-900 py-2"
            >
              {link.name}
            </a>
          ))}
          <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="mt-2 px-4 py-2.5 rounded-md bg-zinc-900 text-white text-sm font-medium text-center hover:bg-zinc-800 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
