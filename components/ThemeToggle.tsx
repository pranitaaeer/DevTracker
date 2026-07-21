'use client';
import React, { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('devtrack_theme');
      if (stored === 'dark') {
        setMode('dark');
        document.documentElement.classList.add('dark');
      }
    } catch (e) { }
  }, []);

  function toggle() {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    try {
      localStorage.setItem('devtrack_theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
    } catch (e) { }
  }

  return (
    <button onClick={toggle} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-sm">
      {mode === 'light' ? 'Light' : 'Dark'}
      <span className="inline-block w-6 h-6 bg-white dark:bg-slate-700 rounded-full border" />
    </button>
  );
}
