import { Target, Code, Lightbulb } from 'lucide-react';

export default function About() {
  const approaches = [
    {
      icon: Target,
      title: "Goal-Oriented",
      description: "Focused on building scalable applications that solve real user problems with elegant architecture."
    },
    {
      icon: Code,
      title: "Clean Code",
      description: "Prioritizing maintainability, type-safety, and modern design patterns in every commit."
    },
    {
      icon: Lightbulb,
      title: "Continuous Learner",
      description: "Always adapting to new technologies and striving to understand the underlying principles."
    }
  ];

  return (
    <section id="about" className="py-32 bg-zinc-50 border-y border-zinc-100">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <div className="max-w-2xl mb-20">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-4">About</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight leading-tight mb-6">
            A passionate software engineer focused on building robust full-stack applications.
          </h3>
          <p className="text-lg text-zinc-600 leading-relaxed font-medium">
            I am a highly motivated computer science graduate with a strong foundation in modern web technologies. My goal is to craft digital experiences that are not only visually minimal, but technically sound and performant from the ground up.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {approaches.map((item, index) => (
            <div key={index} className="p-6 bg-white border border-zinc-200 rounded-xl hover:shadow-sm transition-shadow">
              <div className="h-10 w-10 flex items-center justify-center text-zinc-900 mb-6 bg-zinc-100 rounded-lg">
                <item.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h4 className="text-lg font-bold text-zinc-900 mb-2">{item.title}</h4>
              <p className="text-zinc-600 leading-relaxed text-sm font-medium">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
