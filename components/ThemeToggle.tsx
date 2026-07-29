'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  // 1. Ek extra state add ki to check if component is fully loaded in browser
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('devtrack_theme');
      if (stored === 'light') {
        setMode('light');
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        setMode('dark');
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    } catch (e) {}
    
    // 2. Local storage check hone ke baad isko true kar do
    setMounted(true);
  }, []);

  function toggle() {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);

    try {
      localStorage.setItem('devtrack_theme', next);
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  }

  // 3. Jab tak mount nahi hota, ek blank skeleton/placeholder dikhao
  // Isse hydration delay ya UI breaking nahi hogi
  if (!mounted) {
    return (
      <div className="w-16 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 opacity-50" />
    );
  }

  return (
    <button
      onClick={toggle}
      className="relative flex items-center w-16 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 transition-all duration-300 px-1"
    >
      <span
        className={`absolute flex items-center justify-center h-6 w-6 rounded-full bg-white dark:bg-zinc-900 shadow-md transition-transform duration-300 ${
          mode === 'dark' ? 'translate-x-8' : 'translate-x-0'
        }`}
      >
        {mode === 'light' ? (
          <Sun size={14} className="text-yellow-500" />
        ) : (
          <Moon size={14} className="text-blue-400" />
        )}
      </span>
    </button>
  );
}