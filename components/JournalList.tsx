'use client';

import React from 'react';
import { Pencil, Trash2, BookOpen } from 'lucide-react';

export default function JournalList({
  entries,
  onEdit,
  onDelete,
}: {
  entries: { id: string; date: string; content: string }[];
  onEdit?: (e: any) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {entries.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#111827] p-6 text-center">
          <BookOpen className="mx-auto text-zinc-400 dark:text-zinc-500 mb-2" size={28} />
          <p className="text-sm text-zinc-500">No journal entries yet</p>
        </div>
      ) : (
        entries.map((e) => (
          <div
            key={e.id}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-[#111827] p-4 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                {e.date}
              </div>
              <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => onEdit?.(e)}
                className="h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition"

              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => onDelete?.(e.id)}
                className="h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition flex items-center justify-center"

              >
                <Trash2 size={13} />
              </button>
            </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-800 dark:text-zinc-300 whitespace-pre-wrap">
              {e.content}
            </p>
          </div>
        ))
      )}
    </div>
  );
}