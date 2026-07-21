'use client';

import React from 'react';
import { Trophy } from 'lucide-react';

export default function AchievementsList({ items }: { items: { id: string; title: string; date: string; description?: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map(it => (
        <div key={it.id} className="rounded-xl border border-zinc-800 bg-[#111827] p-4 hover:border-zinc-700 transition-transform duration-200 hover:-translate-y-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Trophy size={18} className="text-emerald-400" />
              </div>

              <div>
                <h3 className="font-medium text-zinc-100">
                  {it.title}
                </h3>

                {it.description && (
                  <p className="text-sm text-zinc-500 mt-1">
                    {it.description}
                  </p>
                )}
              </div>
            </div>

            <span className="text-xs text-zinc-500 whitespace-nowrap">
              {it.date}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}