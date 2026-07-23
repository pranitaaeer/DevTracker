"use client"
import React from 'react';
import dynamic from 'next/dynamic';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import { useEffect, useState } from "react";
import { fetchActivitiesForUser } from "@/lib/supabase/supabase-activities";
import { mockUser } from "@/lib/mockData";

const Heatmap = dynamic(() => import('@/components/Heatmap'), {
  ssr: false,
  loading: () => <div className="h-64 rounded-2xl bg-zinc-900 animate-pulse" />
});

export default function GitHubHeatmapPage() {
  const [contributions, setContributions] = useState<any>({});


  useEffect(() => {

    async function load() {

      const activities =
        await fetchActivitiesForUser(
          mockUser.id
        );


      const map: any = {};


      activities.forEach(activity => {

        const date =
          activity.occurredAt.split("T")[0];


        if (map[date]) {
          map[date]++;
        }
        else {
          map[date] = 1;
        }

      });


      setContributions(map);

    }


    load();

  }, []);


  const hasData =
    Object.keys(contributions).length > 0;

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">GitHub Heatmap</h1>

      <Card>
        {hasData ? <Heatmap contributions={contributions} /> : <EmptyState title="No activity yet" description="Your contribution heatmap will appear here once you log activity." />}
      </Card>
    </main>
  );
}
