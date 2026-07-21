"use client"
import React, { useState } from 'react';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import Dialog from '@/components/Dialog';
import { useDataStore } from '@/stores/useDataStore';
import { useUIStore } from '@/stores/useUIStore';
import { Pencil, Trash2, Plus } from "lucide-react";

export default function InterviewsPage() {
  const interviews = useDataStore(s => s.interviews);
  const addInterview = useDataStore(s => s.addInterview);
  const updateInterview = useDataStore(s => s.updateInterview);
  const deleteInterview = useDataStore(s => s.deleteInterview);
  const addToast = useUIStore(s => s.addToast);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('scheduled');
  const [notes, setNotes] = useState('');

  async function onCreate() {
    await addInterview({ company, role, date, status, notes });
    addToast({ title: 'Interview added' });

    setCompany("");
    setRole("");
    setDate("");
    setStatus("scheduled");
    setNotes("");
    setEditing(null);

    setOpen(false);
  }
  function onEdit(e: any) { setEditing(e); setCompany(e.company); setRole(e.role); setDate(e.date); setStatus(e.status); setNotes(e.notes || ''); setOpen(true); }
  function onUpdate() { if (!editing) return; updateInterview(editing.id, { company, role, date, status, notes }); addToast({ title: 'Interview updated' }); setOpen(false); }
  function onDelete(id: string) { deleteInterview(id); addToast({ title: 'Interview removed' }); }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Interview Tracker</h1>
          <p className="text-sm text-slate-500">
            Track interview stages and notes
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => {
              setEditing(null);
              setCompany("");
              setRole("");
              setDate("");
              setStatus("scheduled");
              setNotes("");
              setOpen(true);
            }}
            className="px-4 py-2 rounded-lg bg-brand-500 text-white"
          >
            + Add Interview
          </button>
        </div>
      </div>

      <Card>
        {interviews.length === 0 ? (
          <EmptyState title="No interviews tracked" description="Add interviews to keep track of upcoming stages and notes." />
        ) : (
          <ul className="space-y-3">
            {interviews.map((i) => (
              <li key={i.id} className="p-3 border rounded bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{i.company} — {i.role}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-slate-500">
                      {new Date(i.date)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        .replace(/ /g, "-")}
                    </span>

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                         ${i.status === "scheduled"
                          ? "bg-blue-100 text-blue-700"
                          : i.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {i.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(i)}
                    className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(i.id)}
                    className="p-2 rounded hover:bg-red-100 text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Interview' : 'Add Interview'}>
        <div className="grid gap-3">
          <label className="text-sm">Company</label>
          <input className="border rounded px-3 py-2 text-black" value={company} onChange={(e) => setCompany(e.target.value)} />
          <label className="text-sm">Role</label>
          <input className="border rounded px-3 py-2 text-black" value={role} onChange={(e) => setRole(e.target.value)} />
          <label className="text-sm">Date</label>
          <input type="date" className="border rounded px-3 py-2 text-black" value={date} onChange={(e) => setDate(e.target.value)} />
          <label className="text-sm">Status</label>
          <select className="border rounded px-3 py-2 text-black" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <label className="text-sm">Notes</label>
          <textarea className="border rounded px-3 py-2 text-black" value={notes} onChange={(e) => setNotes(e.target.value)} />

          <div className="flex justify-end gap-2 mt-3">
            {/* <button onClick={() => setOpen(false)} className="px-3 py-2 rounded">Cancel</button> */}
            <button
              onClick={() => {
                setOpen(false);
                setEditing(null);
                setCompany("");
                setRole("");
                setDate("");
                setStatus("scheduled");
                setNotes("");
              }}
            >
              Cancel
            </button>
            <button onClick={() => editing ? onUpdate() : onCreate()} className="px-3 py-2 rounded bg-brand-500 text-white">Save</button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}
