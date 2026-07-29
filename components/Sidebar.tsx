
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Columns3,
  BriefcaseBusiness,
  Trophy,
  BookOpen,
  BarChart3,
  Sparkles,
  FileText,
  Flame,
  Settings,
  X
} from 'lucide-react';

import { useUIStore } from '@/stores/useUIStore';

const menu = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'Kanban', href: '/kanban', icon: Columns3 },
  { name: 'Interviews', href: '/interviews', icon: BriefcaseBusiness },
  { name: 'Achievements', href: '/achievements', icon: Trophy },
  { name: 'Journal', href: '/journal', icon: BookOpen },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'AI Tasks', href: '/ai-tasks', icon: Sparkles },
  { name: 'Resume', href: '/resume', icon: FileText },
  { name: 'Heatmap', href: '/github-heatmap', icon: Flame },
  { name: 'Settings', href: '/settings', icon: Settings }
];

export default function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const closeSidebar = useUIStore((s) => s.closeSidebar);

  // Common Sidebar Internal Content Component
  const SidebarContent = () => (
    /* YAHAN DEKHO: '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]' add kiya hai */
    <div className="h-full rounded-2xl bg-white dark:bg-[#0d1117] p-4 shadow-xl overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col justify-between">
      <div>
        {/* Header section with mobile close button */}
        <div className="mb-6 px-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              DevTrack
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Developer OS
            </p>
          </div>

          {/* Mobile X Close Button */}
          <button
            onClick={closeSidebar}
            className="lg:hidden p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => closeSidebar()}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition font-medium ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 hover:text-black dark:hover:text-white'
                }`}
              >
                <Icon
                  size={17}
                  className={
                    isActive
                      ? 'text-emerald-500'
                      : 'text-zinc-500 group-hover:text-emerald-400'
                  }
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Streak Card */}
      <div className="mt-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50 p-3">
        <p className="text-xs text-zinc-500">Current streak</p>
        <div className="flex items-center gap-2 mt-2">
          <Flame size={18} className="text-orange-400" />
          <span className="text-zinc-900 dark:text-white font-semibold">
            18 days
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:block fixed left-0 top-[72px] w-80 h-[calc(100vh-72px)] px-4 z-[100]">
        <SidebarContent />
      </aside>

      {/* 2. MOBILE SIDEBAR DRAWER */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-[150]">
          {/* Black Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={closeSidebar}
          />

          {/* Mobile Slide-in Panel */}
          <aside className="fixed left-0 top-0 w-80 h-full p-4 z-[160] transition-transform duration-300">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}