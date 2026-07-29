'use client';

import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Toaster from './Toaster';
import CommandPalette from './CommandPalette';
import { useUIStore } from '@/stores/useUIStore';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const isSidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  useEffect(() => {
    try {
      const theme = localStorage.getItem('devtrack_theme');

      if (theme === 'dark' || !theme) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    } catch {}
  }, []);

  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-[#0d1117] dark:text-zinc-100 transition-colors duration-300">
      <Navbar />

      {/* MOBILE SIDEBAR DRAWER & BACKDROP */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Black Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => toggleSidebar()}
          />

          {/* Sliding Mobile Sidebar Container */}
          <div className="relative flex-1 w-full max-w-xs bg-white dark:bg-[#0d1117] p-4 z-50 shadow-2xl border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-full overflow-y-auto">
            <Sidebar />
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block lg:w-64 shrink-0">
            <Sidebar />
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 min-w-0">
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