'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function Card({
  children,
  title,
  className = '',
}: CardProps) {
  return (
    <div className={`rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0d1117] shadow-lg dark:shadow-[0_10px_35px_rgba(0,0,0,0.25)] hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 ${className}`}>

      {title && (
        <div className="flex items-center justify-between px-5 pt-5">

          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {title}
          </h3>

          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#22c55e]" />

        </div>
      )}

      <div className="p-5">
        {children}
      </div>

    </div>
  );
}