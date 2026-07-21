'use client';

import React, { useMemo, useState } from 'react';
import { Project } from '@/stores/useDataStore';
import { Search, Pencil, Trash2, FolderGit2 } from 'lucide-react';

export default function ProjectsList({ projects, onEdit, onDelete, onView }: { projects: Project[]; onEdit?: (p: Project) => void; onDelete?: (id: string) => void; onView?: (p: Project) => void }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return projects;
    return projects.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || (p.description || '').toLowerCase().includes(query.toLowerCase()));
  }, [projects, query]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects..." className="w-full rounded-xl border border-zinc-800 bg-[#0d1117] pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-zinc-600 transition" />
      </div>
      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-[#0d1117] p-6 text-center text-sm text-zinc-500">No projects found</div>
        ) : (
          filtered.map(p => (
            <div key={p.id} className="group flex items-start gap-4 rounded-2xl border border-zinc-800 bg-[#111827] p-4 hover:border-zinc-700 transition-transform duration-200 hover:-translate-y-1">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${p.color || 'bg-zinc-700'}`}>
                <FolderGit2 size={20} className="text-white" />
              </div>
              <div onClick={() => onView?.(p)} className="flex-1 min-w-0 cursor-pointer">
                <h3 className="font-semibold text-white truncate">{p.name}</h3>
                <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{p.description || 'No description added'}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                {onEdit && (
                  <button onClick={() => onEdit(p)} className="rounded-lg border border-zinc-700 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition">
                    <Pencil size={15} />
                  </button>
                )}
                {onDelete && (
                  <button onClick={() => onDelete(p.id)} className="rounded-lg border border-zinc-700 p-2 text-red-400 hover:bg-red-500/10 transition">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}