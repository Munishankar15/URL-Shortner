import { useState } from 'react';
import { Mail, Send, Loader2 } from 'lucide-react';
import { Github, Linkedin } from './icons';
import { toast } from 'sonner';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock submission with visual feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', message: '' });
      toast.success('Message sent successfully!');
    }, 1500);
  };

  return (
    <section id="contact" className="py-32 bg-white">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <div className="grid lg:grid-cols-5 gap-16 items-start">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-4">Contact</h2>
              <h3 className="text-3xl font-bold text-zinc-900 tracking-tight mb-4">Let's connect.</h3>
              <p className="text-zinc-600 font-medium leading-relaxed">
                I'm currently looking for new opportunities. My inbox is always open.
              </p>
            </div>

            <div className="space-y-6">
              <a href="mailto:hello@example.com" className="flex items-center gap-4 text-zinc-600 hover:text-zinc-900 transition-colors group">
                <div className="w-10 h-10 rounded-lg border border-zinc-200 flex items-center justify-center group-hover:border-zinc-300">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="font-medium">hello@example.com</span>
              </a>

              <a href="#" className="flex items-center gap-4 text-zinc-600 hover:text-zinc-900 transition-colors group">
                <div className="w-10 h-10 rounded-lg border border-zinc-200 flex items-center justify-center group-hover:border-zinc-300">
                  <Github className="h-4 w-4" />
                </div>
                <span className="font-medium">github.com/johndoe</span>
              </a>

              <a href="#" className="flex items-center gap-4 text-zinc-600 hover:text-zinc-900 transition-colors group">
                <div className="w-10 h-10 rounded-lg border border-zinc-200 flex items-center justify-center group-hover:border-zinc-300">
                  <Linkedin className="h-4 w-4" />
                </div>
                <span className="font-medium">linkedin.com/in/johndoe</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="p-8 rounded-2xl border border-zinc-200 bg-white space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full h-11 px-4 rounded-md bg-zinc-50 border border-zinc-200 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 outline-none transition-all font-medium text-sm text-zinc-900"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full h-11 px-4 rounded-md bg-zinc-50 border border-zinc-200 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 outline-none transition-all font-medium text-sm text-zinc-900"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Message</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full p-4 rounded-md bg-zinc-50 border border-zinc-200 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 outline-none transition-all font-medium text-sm text-zinc-900 resize-none"
                  placeholder="How can I help you?"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-md bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                ) : (
                  <><Send className="h-4 w-4" /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
