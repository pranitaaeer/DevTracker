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
console.log("Sidebar rendered");
  const sidebarOpen = useUIStore(
    (s) => s.sidebarOpen
  );

  const closeSidebar = useUIStore(
    (s) => s.closeSidebar
  );

  return (
    <>
      <aside className="hidden lg:block fixed left-0 top-[72px] w-80 h-[calc(100vh-72px)] px-4 z-[100]">
      {/* <aside className="fixed left-0 top-0 h-full w-72 bg-[#0d1117] z-[60] p-5 lg:hidden"> */}
        <div className="h-full rounded-2xl bg-[#0d1117] p-4 shadow-xl overflow-y-auto">

          <div className="mb-6 px-3">
            <h2 className="text-lg font-bold text-white">DevTrack</h2>
            <p className="text-xs text-zinc-500 mt-1">Developer OS</p>
          </div>

          <nav className="space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;

              return (
                <Link key={item.name} href={item.href} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-800/70 hover:text-white">
                  <Icon size={17} className="text-zinc-500 group-hover:text-emerald-400" />
                  <span>{item.name}</span>
                </Link>
              )
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

      {
        sidebarOpen && (
          <>
            <div
              onClick={closeSidebar}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />

            <aside className="fixed left-0 top-0 h-full w-72 bg-[#0d1117] z-50 p-5 lg:hidden">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-white font-bold text-lg">
                  DevTrack
                </h2>

                <button
                  onClick={closeSidebar}
                  className="text-zinc-400 hover:text-white"
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="space-y-1">
                {
                  menu.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        onClick={closeSidebar}
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      >
                        <Icon size={18} />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })
                }
              </nav>

            </aside>
          </>
        )
      }

    </>
  )
}