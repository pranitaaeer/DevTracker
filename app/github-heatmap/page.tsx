"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Card from "@/components/Card";
import EmptyState from "@/components/EmptyState";
import { fetchActivitiesForUser } from "@/lib/supabase/supabase-activities";
import { mockUser } from "@/lib/mockData";
import { Flame, GitCommit, Calendar, Trophy, Zap } from "lucide-react";

const Heatmap = dynamic(() => import("@/components/Heatmap"), {
  ssr: false,
  loading: () => <div className="h-64 rounded-2xl bg-zinc-900/10 animate-pulse" />,
});

export default function GitHubHeatmapPage() {
  const [contributions, setContributions] = useState<Record<string, number>>({});
  const [selectedYear, setSelectedYear] = useState<string>("2026");

  useEffect(() => {
    async function load() {
      const activities = await fetchActivitiesForUser(mockUser.id);
      const map: Record<string, number> = {};

      activities.forEach((activity) => {
        const date = activity.occurredAt.split("T")[0];
        map[date] = (map[date] || 0) + 1;
      });

      setContributions(map);
    }

    load();
  }, []);

  const totalContributions = Object.values(contributions).reduce((a, b) => a + b, 0);
  const hasData = Object.keys(contributions).length > 0;

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          GitHub Heatmap
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Detailed overview of your daily contributions and coding activity.
        </p>
      </div>

      {/* Top: Full Width Heatmap Card */}
      <Card className="p-6">
        {hasData ? (
          <Heatmap contributions={contributions} full={true} />
        ) : (
          <EmptyState
            title="No activity yet"
            description="Your contribution heatmap will appear here once you log activity."
          />
        )}
      </Card>

      {/* Bottom: Horizontal Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Year Filter */}
        <Card className="p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            <Calendar size={14} /> Filter Year
          </div>
          <div className="flex gap-2">
            {["2026", "2025"].map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`flex-1 text-center px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                  selectedYear === year
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {year} Activity
              </button>
            ))}
          </div>
        </Card>

        {/* Card 2: Streak & Commits */}
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-4 h-full items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 shrink-0">
                <Flame size={20} />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-medium">Current Streak</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">
                  18 Days
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-l border-zinc-100 dark:border-zinc-800/80 pl-4">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                <Trophy size={20} />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-medium">Total Commits</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">
                  {totalContributions}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 3: Stats Summary */}
        <Card className="p-4">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Stats Summary
          </p>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-zinc-700 dark:text-zinc-300">
              <span className="flex items-center gap-2">
                <GitCommit size={14} className="text-emerald-500" /> Total Active Days
              </span>
              <span className="font-semibold">{Object.keys(contributions).length}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-700 dark:text-zinc-300">
              <span className="flex items-center gap-2">
                <Zap size={14} className="text-amber-500" /> Best Day Count
              </span>
              <span className="font-semibold">
                {hasData ? Math.max(...Object.values(contributions)) : 0}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}