'use client'
import React from 'react';
import Card from '@/components/Card';
import { useUIStore } from '@/stores/useUIStore';

export default function NotificationsPage() {
  const toasts = useUIStore(s => s.toasts);
  const removeToast = useUIStore(s => s.removeToast);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Notifications</h1>

      <Card>
        {toasts.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No notifications</div>
        ) : (
          <ul className="space-y-3">
            {toasts.map(n => (
              <li key={n.id} className="p-3 border rounded bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-medium">{n.title}</div>
                  {n.description ? <div className="text-sm text-slate-500">{n.description}</div> : null}
                </div>
                <div className="flex flex-col items-end gap-2">
                  {n.action ? <button onClick={() => n.action?.onClick()} className="text-sm text-brand-500">{n.action.label}</button> : null}
                  <button onClick={() => removeToast(n.id)} className="text-sm text-slate-500">Dismiss</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </main>
  );
}
