'use client';

import React from 'react';
import Link from 'next/link';
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
  Settings
} from 'lucide-react';

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
  return (
    <aside className="hidden lg:block fixed left-0 top-[72px] w-80 h-[calc(100vh-72px)] px-4">
      <div className="h-full rounded-2xl  bg-[#0d1117] p-4 shadow-xl overflow-y-auto">
        <div className="mb-6 px-3">
          <h2 className="text-lg font-bold text-white">DevTrack</h2>
          <p className="text-xs text-zinc-500 mt-1">Developer OS</p>
        </div>

        <nav className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.name} className="transition-transform duration-200 hover:translate-x-1">
                <Link href={item.href} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition-all duration-200 hover:bg-zinc-800/70 hover:text-white">
                  <Icon size={17} className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                  <span>{item.name}</span>
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
          <p className="text-xs text-zinc-500">Current streak</p>
          <div className="flex items-center gap-2 mt-2">
            <Flame size={18} className="text-orange-400" />
            <span className="text-white font-semibold">18 days</span>
          </div>
        </div>
      </div>
    </aside>
  );
}