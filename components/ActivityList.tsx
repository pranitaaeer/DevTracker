import React from 'react';
import { Activity } from '@prisma/client';

export default function ActivityList({ activities }: { activities: Activity[] }) {
  if (!activities || activities.length === 0) {
    return <div className="mt-4 text-sm text-slate-500">No recent activities recorded.</div>;
  }

  return (
    <div className="mt-4 bg-white p-4 rounded-md shadow-sm">
      <ul className="space-y-3">
        {activities.map((a) => (
          <li key={a.id} className="flex items-start justify-between">
            <div>
              <div className="font-medium">{a.title}</div>
              <div className="text-sm text-slate-500">{a.notes}</div>
            </div>
            <div className="text-sm text-slate-500">{a.durationMin}m</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
