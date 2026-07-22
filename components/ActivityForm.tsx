"use client";

import { useState } from "react";
import Dialog from "@/components/Dialog";
import { useDataStore } from "@/stores/useDataStore";
import { useUIStore } from "@/stores/useUIStore";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ActivityForm({
  open,
  onClose,
}: Props) {

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

    <Dialog
      open={open}
      onClose={onClose}
      title="Add Activity"
    >

      <div className="space-y-4">

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-[#0d1117] px-4 py-3"
        />

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full rounded-xl border border-zinc-700 bg-[#0d1117] px-4 py-3"
        />

        <input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) =>
            setDuration(Number(e.target.value))
          }
          className="w-full rounded-xl border border-zinc-700 bg-[#0d1117] px-4 py-3"
        />

        <input
          placeholder="Tags (React, Next.js, DSA)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-[#0d1117] px-4 py-3"
        />

        <input
          type="datetime-local"
          value={occurredAt}
          onChange={(e) =>
            setOccurredAt(e.target.value)
          }
          className="w-full rounded-xl border border-zinc-700 bg-[#0d1117] px-4 py-3"
        />

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-700 px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-xl bg-white text-black px-5 py-2"
          >
            Save
          </button>

        </div>

      </div>

    </Dialog>
  );
}