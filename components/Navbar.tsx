'use client';

import React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';
import { useUIStore } from '@/stores/useUIStore';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        sticky top-0 z-50
        border-b border-zinc-200 dark:border-zinc-800
        bg-white/90 dark:bg-[#0d1117]/90
        backdrop-blur-xl
      "
    >
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleSidebar()}
            className="
              md:hidden
              h-10 w-10
              rounded-xl
              border border-zinc-200 dark:border-zinc-800
              bg-zinc-100 dark:bg-[#111827]
              flex items-center justify-center
              text-zinc-700 dark:text-zinc-300
              hover:text-black dark:hover:text-white
              hover:bg-zinc-200 dark:hover:bg-zinc-800
              transition
            "
          >
            <Menu size={20} />
          </button>

          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold shadow-lg">
              D
            </div>
            <div className="hidden sm:block">
              <h1 className="text-black dark:text-white font-semibold tracking-tight leading-none">
                DevTrack
              </h1>
              <p className="text-[11px] text-zinc-500 mt-1">
                Developer Workspace
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* User state load hone ke baad render karega */}
          {isLoaded && (
            <>
              {isSignedIn ? (
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9 rounded-full ring-2 ring-zinc-200 dark:ring-zinc-800 transition-all hover:scale-105",
                   modalBackdrop: 'backdrop-blur-md bg-black/60 fixed inset-0 z-50',
                    }
                  }}
                />
              ) : (
                <SignInButton  mode="modal" >
                  <button className="rounded-xl bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition">
                    Sign in
                  </button>
                </SignInButton>
              )}
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}