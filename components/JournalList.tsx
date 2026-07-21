'use client';

import React from 'react';
import { Pencil, Trash2, BookOpen } from 'lucide-react';

export default function JournalList({ entries, onEdit, onDelete }: { entries: { id: string; date: string; content: string }[]; onEdit?: (e: any) => void; onDelete?: (id: string) => void }) {
  return (
    <div className="space-y-3">
      {entries.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-[#111827] p-6 text-center">
          <BookOpen className="mx-auto text-zinc-500 mb-2" size={28} />
          <p className="text-sm text-zinc-500">No journal entries yet</p>
        </div>
      ) : (
        entries.map(e => (
          <div
            key={e.id}
            className="rounded-2xl border border-zinc-800 bg-[#111827] p-4 hover:border-zinc-700 transition-transform duration-200 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="text-xs text-zinc-500">{e.date}</div>
              <div className="flex gap-2">
                <button onClick={() => onEdit?.(e)} className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 transition">
                  <Pencil size={13} />
                  Edit
                </button>
                <button onClick={() => onDelete?.(e.id)} className="flex items-center gap-1 rounded-lg border border-red-900/50 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 transition">
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-300">{e.content}</p>
          </div>
        ))
      )}
    </div>
  );
}