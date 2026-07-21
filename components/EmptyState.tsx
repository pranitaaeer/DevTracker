'use client';
import React from 'react';

export default function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto max-w-md bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <div className="h-16 w-16 mx-auto rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 mb-4 shadow-lg" />
        <div className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">{title}</div>
        {description ? <div className="text-sm text-slate-600 dark:text-slate-300 mb-4">{description}</div> : null}
        {action ? <div className="mt-3">{action}</div> : null}
      </div>
    </div>
  );
}
