import React from 'react';

export default function LoadingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full rounded-3xl border border-zinc-800 bg-[#0d1117]/95 p-10 shadow-2xl shadow-black/20">
        <div className="h-8 w-48 rounded-full bg-zinc-800 animate-pulse mb-8" />
        <div className="grid gap-6">
          <div className="h-40 rounded-3xl bg-zinc-900 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-32 rounded-3xl bg-zinc-900 animate-pulse" />
            <div className="h-32 rounded-3xl bg-zinc-900 animate-pulse" />
          </div>
          <div className="h-40 rounded-3xl bg-zinc-900 animate-pulse" />
        </div>
      </div>
    </main>
  );
}
