"use client";

import { useState } from "react";
import Dialog from "@/components/Dialog";
import { useDataStore } from "@/stores/useDataStore";
import { useUIStore } from "@/stores/useUIStore";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ActivityForm({ open, onClose }: Props) {
  const addActivity = useDataStore((s) => s.addActivity);
  const addToast = useUIStore((s) => s.addToast);

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState(30);
  const [tags, setTags] = useState("");
  const [occurredAt, setOccurredAt] = useState(
    new Date().toISOString().slice(0, 16)
  );

  async function handleSubmit() {
    if (!title.trim()) return;

    await addActivity({
      userId: "",
      projectId: undefined,
      title,
      notes,
      durationMin: duration,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      occurredAt,
    });

    addToast({
      title: "Activity Added",
    });

    setTitle("");
    setNotes("");
    setDuration(30);
    setTags("");
    setOccurredAt(new Date().toISOString().slice(0, 16));

    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="Add Activity">
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            Title
          </label>
          <input
            placeholder="Enter activity title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-[#0d1117] px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 transition"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            Notes
          </label>
          <textarea
            placeholder="Enter notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-[#0d1117] px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 transition"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            Duration (minutes)
          </label>
          <input
            type="number"
            placeholder="60"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-[#0d1117] px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 transition"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            Tags
          </label>
          <input
            placeholder="React, Next.js, DSA"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-[#0d1117] px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 transition"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-zinc-300">
            Date & Time
          </label>
          <input
            type="datetime-local"
            value={occurredAt}
            onChange={(e) => setOccurredAt(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-[#0d1117] px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 transition [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-3 py-2 rounded bg-brand-500 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </Dialog>
  );
}