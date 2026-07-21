'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AnalyticsChart({ data }: { data: { day: string; hours: number }[] }) {
  return (
    <div className="w-full h-64 rounded-2xl border border-zinc-800 bg-[#111827] p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis dataKey="day" stroke="#71717a" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis stroke="#71717a" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "#0d1117",
              border: "1px solid #27272a",
              borderRadius: "12px",
              color: "#fff"
            }}
            labelStyle={{ color: "#a1a1aa" }}
          />
          <Line
            type="monotone"
            dataKey="hours"
            stroke="#10b981"
            strokeWidth={3}
            dot={{
              r: 4,
              fill: "#10b981",
              stroke: "#0d1117",
              strokeWidth: 2
            }}
            activeDot={{
              r: 6
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}