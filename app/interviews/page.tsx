

"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/Card";
import EmptyState from "@/components/EmptyState";
import Dialog from "@/components/Dialog";
import { useDataStore } from "@/stores/useDataStore";
import { useUIStore } from "@/stores/useUIStore";
import { useUser } from "@clerk/nextjs";
import { Pencil, Trash2, Plus } from "lucide-react";

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "object" && e !== null && "message" in e) {
    return String((e as any).message);
  }
  return typeof e === "string" ? e : "An unexpected error occurred";
}

export default function InterviewsPage() {
  const { user, isLoaded } = useUser();

  const interviews = useDataStore((s) => s.interviews ?? []);
  const addInterview = useDataStore((s) => s.addInterview);
  const updateInterview = useDataStore((s) => s.updateInterview);
  const deleteInterview = useDataStore((s) => s.deleteInterview);
  const loadInterviews = useDataStore((s) => s.loadInterviews);
  const addToast = useUIStore((s) => s.addToast);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"scheduled" | "completed" | "cancelled">("scheduled");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load interviews for the Clerk User
  useEffect(() => {
    if (isLoaded && user?.id) {
      loadInterviews(user.id);
    }
  }, [isLoaded, user?.id, loadInterviews]);

  function resetForm() {
    setCompany("");
    setRole("");
    setDate("");
    setStatus("scheduled");
    setNotes("");
    setEditing(null);
  }

  async function onCreate() {
    if (!user?.id || !company.trim() || !role.trim()) return;
    setSubmitting(true);
    try {
      // ✅ Clerk user.id 1st argument mein pass ki
      await addInterview(user.id, { company, role, date, status, notes });
      addToast({ title: "Interview added" });
      setOpen(false);
      resetForm();
    } catch (e) {
      addToast({ title: "Failed to add interview", description: getErrorMessage(e) });
    } finally {
      setSubmitting(false);
    }
  }

  function onEdit(e: any) {
    setEditing(e);
    setCompany(e.company || "");
    setRole(e.role || "");
    setDate(e.date || "");
    setStatus(e.status || "scheduled");
    setNotes(e.notes || "");
    setOpen(true);
  }

  async function onUpdate() {
    if (!editing || !user?.id) return;
    setSubmitting(true);
    try {
      // ✅ 1st: userId, 2nd: id, 3rd: patch
      await updateInterview(user.id, editing.id, { company, role, date, status, notes });
      addToast({ title: "Interview updated" });
      setOpen(false);
      resetForm();
    } catch (e) {
      addToast({ title: "Failed to update interview", description: getErrorMessage(e) });
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: string) {
    if (!user?.id) return;
    try {
      // ✅ 1st: userId, 2nd: id
      await deleteInterview(user.id, id);
      addToast({ title: "Interview removed" });
    } catch (e) {
      addToast({ title: "Delete failed", description: getErrorMessage(e) });
    }
  }

  if (!isLoaded) return null;

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Interview Tracker</h1>
          <p className="text-sm text-slate-500">
            Track interview stages and notes
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
            disabled={!user}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2.5 text-sm font-semibold transition hover:scale-105 shadow-sm disabled:opacity-50"
          >
            <Plus size={17} /> Add Interview
          </button>
        </div>
      </div>

      <Card>
        {interviews.length === 0 ? (
          <EmptyState
            title="No interviews tracked"
            description="Add interviews to keep track of upcoming stages and notes."
          />
        ) : (
          <ul className="space-y-3">
            {interviews.map((i) => (
              <li
                key={i.id}
                className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-slate-50 dark:bg-zinc-900/50 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-white">
                    {i.company} — {i.role}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-slate-500">
                      {i.date
                        ? new Date(i.date)
                            .toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                            .replace(/ /g, "-")
                        : "No Date"}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        i.status === "scheduled"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                          : i.status === "completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                      }`}
                    >
                      {i.status}
                    </span>
                  </div>
                  {i.notes && (
                    <p className="text-xs text-zinc-500 mt-2">{i.notes}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(i)}
                    className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 transition"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(i.id)}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit Interview" : "Add Interview"}
      >
        <div className="grid gap-3 py-1 text-zinc-800 dark:text-zinc-200">
          <label className="text-sm font-medium">Company</label>
          <input
            className="border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl px-3.5 py-2 text-sm text-zinc-900 dark:text-white"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Google"
          />

          <label className="text-sm font-medium">Role</label>
          <input
            className="border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl px-3.5 py-2 text-sm text-zinc-900 dark:text-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Frontend Engineer"
          />

          <label className="text-sm font-medium">Date</label>
          <input
            type="date"
            className="border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl px-3.5 py-2 text-sm text-zinc-900 dark:text-white"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label className="text-sm font-medium">Status</label>
          <select
            className="border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl px-3.5 py-2 text-sm text-zinc-900 dark:text-white"
            value={status}
            onChange={(e: any) => setStatus(e.target.value)}
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <label className="text-sm font-medium">Notes</label>
          <textarea
            className="border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl px-3.5 py-2 text-sm text-zinc-900 dark:text-white resize-none h-24"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional details..."
          />

          <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
              className="px-3 py-2 rounded-lg text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={submitting || !company.trim() || !role.trim()}
              onClick={() => (editing ? onUpdate() : onCreate())}
              className="px-4 py-2 rounded-lg bg-brand-500 text-white text-sm disabled:opacity-50"
            >
              {submitting ? "Saving..." : editing ? "Save Changes" : "Save"}
            </button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}