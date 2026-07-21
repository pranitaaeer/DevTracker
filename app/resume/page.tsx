"use client"

import React from 'react';
import { mockUser } from '@/lib/mockData';
import Card from '@/components/Card';
import { useDataStore } from '@/stores/useDataStore';
import { useUIStore } from '@/stores/useUIStore';

export default function ResumePage() {
  const projects = useDataStore(s => s.projects);
  const achievements = useDataStore(s => s.achievements);
  const addToast = useUIStore(s => s.addToast);

  function onCopy() {
    const payload = { profile: mockUser, projects, achievements };
    try {
      navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      addToast({ title: 'Copied resume JSON to clipboard' });
    } catch (e) {
      addToast({ title: 'Copy failed' });
    }
  }

  function onExport() {
    const payload = { profile: mockUser, projects, achievements };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'devtrack-resume.json';
    a.click();
    URL.revokeObjectURL(url);
    addToast({ title: 'Exported resume JSON' });
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Resume Builder</h1>
        <div className="text-sm text-slate-500">Export a polished resume from your profile and achievements</div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-medium">{mockUser.name}</h2>
            <div className="text-sm text-slate-500">{mockUser.email}</div>
            <p className="mt-2 text-slate-700 dark:text-slate-300">{mockUser.bio}</p>

            <div className="mt-4">
              <h3 className="font-semibold">Projects</h3>
              <ul className="list-disc pl-5">
                {projects.map((p) => (
                  <li key={p.id}>{p.name} — {p.description}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Achievements</h3>
              <ul className="list-disc pl-5">
                {achievements.map((a) => (
                  <li key={a.id}>{a.title} — {a.date}</li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="w-full md:w-56 mt-6 md:mt-0">
            <div className="p-3 border rounded bg-slate-50 dark:bg-slate-800">
              <div className="text-sm text-slate-600">Export</div>
              <div className="mt-2 flex gap-2">
                <button onClick={onExport} className="px-3 py-2 bg-brand-500 text-white rounded">Export JSON</button>
                <button onClick={onCopy} className="px-3 py-2 border rounded">Copy JSON</button>
              </div>
            </div>
          </aside>
        </div>
      </Card>
    </main>
  );
}
