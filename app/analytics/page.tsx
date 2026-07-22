"use client"

import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Card from '@/components/Card';
import { useDataStore } from '@/stores/useDataStore';
import { useEffect } from "react";
import { mockUser } from "@/lib/mockData";
import ActivityForm from '@/components/ActivityForm';
import Dialog from "@/components/Dialog";

const AnalyticsChart = dynamic(() => import('@/components/AnalyticsChart'), {
  ssr: false,
  loading: () => <div className="h-64 rounded-2xl bg-zinc-900 animate-pulse" />
});

export default function AnalyticsPage() {
  const loadActivities = useDataStore(s => s.loadActivities);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadActivities(mockUser.id);
  }, []);

  const activities = useDataStore(s => s.activities);

  const weekly = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const map: Record<string, number> = {};
    for (let i = 0; i < 7; i++) map[days[i]] = 0;
    activities.forEach(a => {
      const d = new Date(a.createdAt);
      map[days[d.getDay()]] += (a.durationMin || 0) / 60;
    });
    return days.map(day => ({ day, hours: Math.round((map[day] || 0) * 10) / 10 }));
  }, [activities]);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <div className="text-sm text-slate-500">Developer insights and metrics</div>
        <button
          onClick={() => {
            setOpen(true)
          }}
          className="flex items-center gap-2 rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold transition-transform duration-200 hover:scale-105 active:scale-95"

        >
          + Add Activity
        </button>
      </div>

      <Card>
        <AnalyticsChart data={weekly} />
      </Card>
      <ActivityForm
    open={open}
    onClose={() => setOpen(false)}
/>

    </main>
  );
}
