'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const ActivitySchema = z.object({
  title: z.string().min(2, 'Title is required'),
  durationMin: z.number().min(0),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof ActivitySchema> & { userId: string };

export default function ActivityForm({ userId }: { userId: string }) {
  const { register, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(ActivitySchema),
    defaultValues: { title: '', durationMin: 30, notes: '', userId }
  });

  async function onSubmit(values: FormValues) {
    try {
      await fetch('/api/actions/activity/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
      // Optimistic UI: reset the form immediately; activity list should be revalidated by next render or SWR
      reset({ title: '', durationMin: 30, notes: '', userId });
    } catch (err) {
      console.error('Failed to create activity', err);
    }
  }

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="bg-white p-4 rounded-md shadow-sm">
      <div className="grid gap-3">
        <label className="text-sm">Title</label>
        <input {...register('title')} className="border p-2 rounded" />

        <label className="text-sm">Duration (minutes)</label>
        <input type="number" {...register('durationMin', { valueAsNumber: true })} className="border p-2 rounded" />

        <label className="text-sm">Notes</label>
        <textarea {...register('notes')} className="border p-2 rounded" />

        <div className="flex justify-end">
          <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded">Add Activity</button>
        </div>
      </div>
    </form>
  );
}
