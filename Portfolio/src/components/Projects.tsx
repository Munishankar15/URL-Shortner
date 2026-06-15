import { ExternalLink } from 'lucide-react';
import { Github } from './icons';

export default function Projects() {
  const projects = [
    {
      title: "URL Shortener",
      description: "A production-ready URL shortener featuring JWT authentication, comprehensive analytics, and an elegant dashboard.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?fit=crop&w=800&q=80",
      tech: ["Next.js", "NestJS", "PostgreSQL", "Tailwind CSS"],
      github: "#",
      live: "#"
    },
    {
      title: "E-Commerce Platform",
      description: "A scalable e-commerce storefront with dynamic product filtering, complex cart state management, and mock checkout.",
      image: "https://images.unsplash.com/photo-1472851294608-062f124dcb02?fit=crop&w=800&q=80",
      tech: ["React", "TypeScript", "Redux", "Node.js"],
      github: "#",
      live: "#"
    }
  ];

  return (
    <section id="projects" className="py-32 bg-zinc-50 border-y border-zinc-100">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <div className="mb-16">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-4">Work</h2>
          <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">Featured Projects</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <div key={idx} className="group bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="h-60 overflow-hidden bg-zinc-100">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
              </div>
              
              <div className="p-8">
                <h4 className="text-xl font-bold text-zinc-900 mb-3">{project.title}</h4>
                <p className="text-zinc-600 text-sm leading-relaxed mb-6 font-medium">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech.map((tech, tIdx) => (
                    <span key={tIdx} className="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <a href={project.live} className="flex-1 py-2 bg-zinc-900 text-white text-sm font-semibold rounded hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                    Live Demo <ExternalLink className="h-4 w-4" />
                  </a>
                  <a href={project.github} className="flex-1 py-2 bg-white border border-zinc-200 text-zinc-900 text-sm font-semibold rounded hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2">
                    Source <Github className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
