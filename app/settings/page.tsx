"use client"

import React from 'react';
import Card from '@/components/Card';
import { useDataStore } from '@/stores/useDataStore';
import { useUIStore } from '@/stores/useUIStore';

export default function SettingsPage() {
  const reset = useDataStore(s => s.resetToMockData);
  const addToast = useUIStore(s => s.addToast);

  function onReset() {
    if (!confirm('Reset demo data to initial seed? This will overwrite current data.')) return;
    reset();
    addToast({ title: 'Demo data reset' });
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>

      <Card title="Profile">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-600">Name</label>
            <div className="mt-1">Dev Track User</div>
          </div>
          <div>
            <label className="text-sm text-slate-600">Email</label>
            <div className="mt-1">dev@devtrack.local</div>
          </div>
        </div>
      </Card>

      <Card title="Preferences" className="mt-4">
        <div className="text-sm text-slate-600">Theme and appearance settings are available in the top-right.</div>
        <div className="mt-4">
          <button onClick={onReset} className="px-3 py-2 rounded bg-red-600 text-white">Reset demo data</button>
        </div>
      </Card>
    </main>
  );
}
