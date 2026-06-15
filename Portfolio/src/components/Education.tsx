import { GraduationCap, BookOpen } from 'lucide-react';

export default function Education() {
  return (
    <section id="education" className="py-32 bg-white">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <div className="mb-16">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-4">Background</h2>
          <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">Education</h3>
        </div>

        <div className="max-w-3xl">
          <div className="p-8 border border-zinc-200 rounded-xl bg-zinc-50 hover:bg-white transition-colors duration-300">
            
            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-8 pb-8 border-b border-zinc-200">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-zinc-200 flex items-center justify-center text-zinc-900 shrink-0">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-zinc-900">B.S. Computer Science</h4>
                  <p className="text-zinc-600 font-medium">University of Technology</p>
                </div>
              </div>
              <div className="inline-flex px-3 py-1 bg-white border border-zinc-200 rounded text-zinc-700 font-bold text-xs shrink-0 self-start md:self-auto tracking-widest">
                2020 - 2024
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-zinc-900 font-bold mb-4 text-sm uppercase tracking-wider">
                <BookOpen className="h-4 w-4" /> Relevant Coursework
              </div>
              <div className="flex flex-wrap gap-2">
                {["Data Structures & Algorithms", "Web Development", "Database Management", "Software Engineering", "Computer Networks", "Operating Systems"].map((course, idx) => (
                  <div key={idx} className="px-3 py-1.5 rounded-md bg-white border border-zinc-200 text-zinc-600 font-medium text-sm">
                    {course}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
