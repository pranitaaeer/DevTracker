"use client"
import React, { useState } from 'react';
import JournalList from '@/components/JournalList';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import Dialog from '@/components/Dialog';
import { useDataStore } from '@/stores/useDataStore';
import { useUIStore } from '@/stores/useUIStore';

export default function JournalPage() {
  const journal = useDataStore(s => s.journal);
  const addJournal = useDataStore(s => s.addJournal);
  const updateJournal = useDataStore(s => s.updateJournal);
  const deleteJournal = useDataStore(s => s.deleteJournal);
  const addToast = useUIStore(s => s.addToast);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');

  function onCreate() {
    addJournal({ date, content });
    addToast({ title: 'Journal entry saved' });
    setOpen(false); setDate(''); setContent('');
  }

  function onUpdate() {
    if (!editing) return;
    updateJournal(editing.id, { date, content });
    addToast({ title: 'Journal updated' });
    setEditing(null); setOpen(false);
  }

  function onEdit(e:any) { setEditing(e); setDate(e.date); setContent(e.content); setOpen(true); }
  function onDelete(id:string) { deleteJournal(id); addToast({ title: 'Entry deleted' }); }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Daily Journal</h1>
        <div className="text-sm text-slate-500">Capture daily notes and reflections</div>
      </div>

      <Card>
        {journal.length === 0 ? (
          <EmptyState title="No journal entries" description="Write your first entry to start tracking your progress." action={<button onClick={() => setOpen(true)} className="px-3 py-2 rounded bg-brand-500 text-white">New Entry</button>} />
        ) : (
          <JournalList entries={journal} onEdit={onEdit} onDelete={onDelete} />
        )}
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Entry' : 'New Entry'}>
        <div className="grid gap-3">
          <label className="text-sm">Date</label>
          <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="border rounded px-3 py-2" />
          <label className="text-sm">Content</label>
          <textarea value={content} onChange={(e)=>setContent(e.target.value)} className="border rounded px-3 py-2 h-40" />

          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setOpen(false)} className="px-3 py-2 rounded">Cancel</button>
            <button onClick={() => editing ? onUpdate() : onCreate()} className="px-3 py-2 rounded bg-brand-500 text-white">Save</button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}
