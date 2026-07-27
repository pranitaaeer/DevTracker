import React from 'react';
import Link from 'next/link';
import { ArrowRight, Github, Code2, Flame, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0d1117] text-zinc-900 dark:text-white flex items-center justify-center px-6 transition-colors duration-300">
      <section className="max-w-5xl w-full py-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-[#161b22] px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 mb-8">
          <Code2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
          Developer Operating System
        </div>

        {/* Hero Heading */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
          Track your coding journey.
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600 dark:from-emerald-400 dark:to-green-500">
            Build. Learn. Improve.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          DevTrack helps developers track coding activity, manage projects, maintain streaks, analyze progress and showcase their growth journey.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap gap-4">
          <Link 
            href="/dashboard" 
            className="group flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-white px-6 py-3 font-medium text-white dark:text-black transition-all hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm"
          >
            Open Dashboard
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link 
            href="/projects" 
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-[#161b22] px-6 py-3 font-medium text-zinc-900 dark:text-white transition-all hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-100 dark:hover:bg-[#1c2128]"
          >
            View Projects
          </Link>
        </div>

        {/* Features Cards Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#111111] p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition shadow-sm">
            <Github className="h-6 w-6 text-emerald-500 dark:text-emerald-400 mb-4" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              GitHub Style Activity
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Visualize your daily coding contributions with a GitHub inspired heatmap.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#111111] p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition shadow-sm">
            <Flame className="h-6 w-6 text-orange-500 dark:text-orange-400 mb-4" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Coding Streaks
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Build consistency and track your longest developer streak.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#111111] p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition shadow-sm">
            <BarChart3 className="h-6 w-6 text-blue-500 dark:text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Developer Analytics
            </h3>
            <p className="mt-2 text-sm text-zinc-400 text-zinc-600 dark:text-zinc-400">
              Understand your productivity with weekly and monthly insights.
            </p>
          </div>
        </div>

        {/* Bottom Banner Card */}
        <div className="mt-20 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#111111] p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                Your developer journey, tracked beautifully.
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                From first commit to professional growth.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0d1117] px-5 py-3 shadow-xs">
                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                  Tasks
                </p>
                <p className="text-xl font-bold text-zinc-900 dark:text-white">
                  120+
                </p>
              </div>

              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0d1117] px-5 py-3 shadow-xs">
                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                  Streak
                </p>
                <p className="text-xl font-bold text-zinc-900 dark:text-white">
                  🔥 30
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}