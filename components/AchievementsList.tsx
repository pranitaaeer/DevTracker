'use client';

import React from 'react';
import { Trophy } from 'lucide-react';

export default function AchievementsList({
  items,
}: {
  items: { id: string; title: string; date: string; description?: string }[];
}) {
  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#111827] p-6 text-center">
          <Trophy className="mx-auto text-zinc-400 dark:text-zinc-500 mb-2" size={28} />
          <p className="text-sm text-zinc-500">No achievements unlocked yet</p>
        </div>
      ) : (
        items.map((it) => (
          <div
            key={it.id}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-[#111827] p-4 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 flex items-center justify-center">
                  <Trophy size={18} className="text-emerald-600 dark:text-emerald-400" />
                </div>

                <div>
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                    {it.title}
                  </h3>

                  {it.description && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {it.description}
                    </p>
                  )}
                </div>
              </div>

              <span className="text-xs text-zinc-400 dark:text-zinc-500 whitespace-nowrap font-medium">
                {it.date}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}