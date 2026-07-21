'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/stores/useUserStore';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';

export default function Navbar() {
  const user = useStore((s) => s.user);

  const links = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Projects', href: '/projects' },
    { name: 'Kanban', href: '/kanban' },
    { name: 'Heatmap', href: '/github-heatmap' },
  ];

  return (
    <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 z-50 border-b border-zinc-800 bg-[#0d1117]/95 backdrop-blur">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <div className="flex items-center gap-10">

          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-black font-bold text-sm">
              D
            </div>
            <span className="text-white font-semibold tracking-tight">
              DevTrack
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all">
                {link.name}
              </Link>
            ))}
          </div>

        </div>


        <div className="flex items-center gap-4">

          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-3 border border-zinc-800 bg-[#111111] rounded-full px-3 py-1.5">

              <div className="h-7 w-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-white font-medium">
                {user.name?.charAt(0) || 'D'}
              </div>

              <span className="hidden sm:block text-sm text-zinc-300">
                {user.name ?? user.email}
              </span>

            </div>
          ) : (
            <Link href="/login" className="text-sm text-white bg-white/10 border border-zinc-700 px-4 py-2 rounded-lg hover:bg-white/20 transition">
              Sign in
            </Link>
          )}

        </div>

      </div>
    </motion.nav>
  );
}