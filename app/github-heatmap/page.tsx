"use client"
import React from 'react';
import dynamic from 'next/dynamic';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';

const Heatmap = dynamic(() => import('@/components/Heatmap'), {
  ssr: false,
  loading: () => <div className="h-64 rounded-2xl bg-zinc-900 animate-pulse" />
});

export default function GitHubHeatmapPage() {
  const contributions = {};
  const hasData = Object.keys(contributions).length > 0;

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">GitHub Heatmap</h1>

      <Card>
        {hasData ? <Heatmap contributions={contributions} /> : <EmptyState title="No activity yet" description="Your contribution heatmap will appear here once you log activity." />}
      </Card>
    </main>
  );
}
