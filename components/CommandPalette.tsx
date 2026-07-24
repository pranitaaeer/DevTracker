'use client';
import React, { useEffect, useState } from 'react';
import Dialog from './Dialog';
import { useDataStore } from '@/stores/useDataStore';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const projects = useDataStore(s => s.projects);
  const aiTasks = useDataStore(s => s.aiTasks);
  const [q, setQ] = useState('');

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(o => !o); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = [...projects.map(p => ({ id: p.id, label: p.name, type: 'project' })), 
    ...aiTasks.map(t => ({ id: t.id, label: t.title ?? "", type: 'ai' }))]
    .filter(r =>
    (r.label ?? "")
      .toLowerCase()
      .includes(q.toLowerCase())
)

  return (
    <Dialog open={open} onClose={() => setOpen(false)} title="Quick Open">
      <div>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects, tasks... (Ctrl/Cmd+K)" className="w-full border rounded px-3 py-2 mb-3" />
        <ul className="max-h-60 overflow-auto">
          {results.map(r => (
            <li key={r.id} className="p-2 hover:bg-slate-100 rounded cursor-pointer">{r.label} <span className="text-xs text-slate-400">{r.type}</span></li>
          ))}
        </ul>
      </div>
    </Dialog>
  );
}
