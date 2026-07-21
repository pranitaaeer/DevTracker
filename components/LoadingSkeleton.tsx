'use client';
import React from 'react';

export default function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded ${className} bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700 animate-pulse`} />
  );
}
