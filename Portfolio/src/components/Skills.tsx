export default function Skills() {
  const skillCategories = [
    {
      title: "Frontend",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "HTML5", "CSS3"]
    },
    {
      title: "Backend",
      skills: ["Node.js", "Express.js", "NestJS", "REST APIs", "GraphQL"]
    },
    {
      title: "Database",
      skills: ["PostgreSQL", "MongoDB", "Prisma", "Redis"]
    },
    {
      title: "Tools",
      skills: ["Git", "GitHub", "Docker", "VS Code", "Vercel"]
    }
  ];

  return (
    <section id="skills" className="py-32 bg-white">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <div className="mb-16">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-4">Capabilities</h2>
          <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">Technical Arsenal</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category, idx) => (
            <div key={idx} className="space-y-6">
              <h4 className="text-sm font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-4">{category.title}</h4>
              <ul className="space-y-3">
                {category.skills.map((skill, sIdx) => (
                  <li key={sIdx} className="text-zinc-600 text-sm font-medium flex items-center gap-2">
                    <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
