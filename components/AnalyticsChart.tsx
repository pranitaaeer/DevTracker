'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AnalyticsChart({ data }: { data: { day: string; hours: number }[] }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" vertical={false} />
          <XAxis 
            dataKey="day" 
            className="text-zinc-500 dark:text-zinc-400" 
            tick={{ fontSize: 12, fill: 'currentColor' }} 
            axisLine={false} 
            tickLine={false} 
          />
          <YAxis 
            className="text-zinc-500 dark:text-zinc-400" 
            tick={{ fontSize: 12, fill: 'currentColor' }} 
            axisLine={false} 
            tickLine={false} 
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg, #ffffff)',
              borderColor: 'var(--tooltip-border, #e4e4e7)',
              borderRadius: '12px',
              fontSize: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
            wrapperClassName="dark:[--tooltip-bg:#111827] dark:[--tooltip-border:#27272a]"
            labelClassName="text-zinc-500 dark:text-zinc-400 font-medium"
            itemStyle={{ color: '#10b981', fontWeight: 600 }}
          />
          <Line
            type="monotone"
            dataKey="hours"
            stroke="#10b981"
            strokeWidth={3}
            dot={{
              r: 4,
              fill: '#10b981',
              strokeWidth: 0,
            }}
            activeDot={{
              r: 6,
              strokeWidth: 0,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}