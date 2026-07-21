import React from 'react';
import Link from 'next/link';
import { ArrowRight, Github, Code2, Flame, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center px-6">
      <section className="max-w-5xl w-full py-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-[#161b22] px-4 py-2 text-sm text-zinc-400 mb-8">
          <Code2 className="h-4 w-4 text-emerald-400" />
          Developer Operating System
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
          Track your coding journey.
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">
            Build. Learn. Improve.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-400 leading-relaxed">
          DevTrack helps developers track coding activity, manage projects, maintain streaks, analyze progress and showcase their growth journey.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/dashboard" className="group flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-black transition-all hover:bg-zinc-200">
            Open Dashboard
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link href="/projects" className="rounded-lg border border-zinc-700 bg-[#161b22] px-6 py-3 font-medium text-white transition-all hover:border-zinc-500">
            View Projects
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-xl border border-zinc-800 bg-[#111111] p-6 hover:border-zinc-700 transition">
            <Github className="h-6 w-6 text-emerald-400 mb-4" />
            <h3 className="text-lg font-semibold">
              GitHub Style Activity
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              Visualize your daily coding contributions with a GitHub inspired heatmap.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-[#111111] p-6 hover:border-zinc-700 transition">
            <Flame className="h-6 w-6 text-orange-400 mb-4" />
            <h3 className="text-lg font-semibold">
              Coding Streaks
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              Build consistency and track your longest developer streak.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-[#111111] p-6 hover:border-zinc-700 transition">
            <BarChart3 className="h-6 w-6 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold">
              Developer Analytics
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              Understand your productivity with weekly and monthly insights.
            </p>
          </div>
        </div>

        <div className="mt-20 rounded-2xl border border-zinc-800 bg-[#111111] p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold">
                Your developer journey, tracked beautifully.
              </h2>
              <p className="mt-2 text-zinc-400">
                From first commit to professional growth.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-lg border border-zinc-800 bg-[#0d1117] px-5 py-3">
                <p className="text-xs text-zinc-500">
                  Tasks
                </p>
                <p className="text-xl font-bold">
                  120+
                </p>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-[#0d1117] px-5 py-3">
                <p className="text-xs text-zinc-500">
                  Streak
                </p>
                <p className="text-xl font-bold">
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