
"use client";

import React, { useEffect, useState } from "react";
import JournalList from "@/components/JournalList";
import Card from "@/components/Card";
import EmptyState from "@/components/EmptyState";
import Dialog from "@/components/Dialog";
import { useDataStore } from "@/stores/useDataStore";
import { useUIStore } from "@/stores/useUIStore";
import { mockUser } from "@/lib/mockData";
import { Plus } from "lucide-react";

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "object" && e !== null && "message" in e) {
    return String((e as any).message);
  }
  return typeof e === "string" ? e : "An unexpected error occurred";
}

export default function JournalPage() {
  const journal = useDataStore((s) => s.journal ?? []);
  const addJournal = useDataStore((s) => s.addJournal);
  const updateJournal = useDataStore((s) => s.updateJournal);
  const deleteJournal = useDataStore((s) => s.deleteJournal);
  const loadJournal = useDataStore((s) => s.loadJournal);
  const addToast = useUIStore((s) => s.addToast);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (mockUser?.id) {
      loadJournal(mockUser.id);
    }
  }, [loadJournal]);

  function resetForm() {
    setDate("");
    setContent("");
    setEditing(null);
  }

  async function onCreate() {
    if (!mockUser?.id || !content.trim()) return;
    setSubmitting(true);
    try {
      // Fix: Passed mockUser.id as 1st argument
      await addJournal(mockUser.id, { date, content });
      addToast({ title: "Journal entry saved" });
      setOpen(false);
      resetForm();
    } catch (e) {
      addToast({ title: "Failed to save entry", description: getErrorMessage(e) });
    } finally {
      setSubmitting(false);
    }
  }

  async function onUpdate() {
    if (!editing || !mockUser?.id) return;
    setSubmitting(true);
    try {
      // Fix: Passed userId as 1st argument, id as 2nd, patch as 3rd
      await updateJournal(mockUser.id, editing.id, { date, content });
      addToast({ title: "Journal updated" });
      setOpen(false);
      resetForm();
    } catch (e) {
      addToast({ title: "Failed to update entry", description: getErrorMessage(e) });
    } finally {
      setSubmitting(false);
    }
  }

  function onEdit(entry: any) {
    setEditing(entry);
    setDate(entry.date || "");
    setContent(entry.content || "");
    setOpen(true);
  }

  async function onDelete(id: string) {
    if (!mockUser?.id) return;
    try {
      // Fix: Passed userId as 1st argument, id as 2nd
      await deleteJournal(mockUser.id, id);
      addToast({ title: "Entry deleted" });
    } catch (e) {
      addToast({ title: "Delete failed", description: getErrorMessage(e) });
    }
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Daily Journal
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Capture daily notes and reflections
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2.5 text-sm font-semibold transition hover:scale-105 shadow-sm"
        >
          <Plus size={17} />
          New Entry
        </button>
      </div>

      <Card>
        {journal.length === 0 ? (
          <EmptyState
            title="No journal entries"
            description="Write your first entry to start tracking your progress."
          />
        ) : (
          <JournalList
            entries={journal}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Entry" : "New Entry"}
      >
        <div className="grid gap-3 py-1">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />

          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your journal entry..."
            className="w-full border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-xl px-3.5 py-2 h-40 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 resize-none"
          />

          <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={submitting || !content.trim()}
              onClick={() => (editing ? onUpdate() : onCreate())}
              className="px-3 py-2 rounded bg-brand-500 text-white text-sm disabled:opacity-50 transition"
            >
              {submitting ? "Saving..." : editing ? "Save Changes" : "Save"}
            </button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}