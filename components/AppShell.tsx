'use client';

import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import Toaster from './Toaster';
import CommandPalette from './CommandPalette';
import { useUIStore } from '@/stores/useUIStore';

export default function AppShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      const theme = localStorage.getItem('devtrack_theme');
      if (theme === 'dark' || !theme) document.documentElement.classList.add('dark');
    } catch { }
  }, []);

  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  return (
    <div className="min-h-screen bg-[#0d1117] text-zinc-100">
      <Navbar />

      <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* <div className="flex"> */}
          <div className="lg:w-64">
            <Sidebar />
          </div>

          <main className="flex-1 min-w-0">
            {/* <main className="flex-1 min-w-0 lg:ml-64"> */}
            <div className="animate-in fade-in duration-500">
              {children}
            </div>
          </main>
        </div>
      </div>

      <Toaster toasts={toasts} onDismiss={removeToast} />

      <CommandPalette />
    </div>
  );
}