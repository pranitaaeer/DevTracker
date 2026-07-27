"use client"
import React, { useEffect, useState } from 'react';
import JournalList from '@/components/JournalList';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import Dialog from '@/components/Dialog';
import { useDataStore } from '@/stores/useDataStore';
import { useUIStore } from '@/stores/useUIStore';
import { mockUser } from '@/lib/mockData';
import { Trophy, Plus, Pencil, Trash2 } from 'lucide-react';

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

  async function onCreate() {
   await addJournal({ date, content });
    addToast({ title: 'Journal entry saved' });
    setOpen(false); setDate(''); setContent('');
  }

  async function onUpdate() {
    if (!editing) return;
   await updateJournal(editing.id, { date, content });
    addToast({ title: 'Journal updated' });
    setEditing(null); setOpen(false);
  }

  function onEdit(e:any) { setEditing(e); setDate(e.date); setContent(e.content); setOpen(true); }
 async function onDelete(id:string) {await deleteJournal(id); addToast({ title: 'Entry deleted' }); }

 const loadJournal = useDataStore(s => s.loadJournal);

useEffect(() => {
  loadJournal(mockUser.id);
}, []);
  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Daily Journal</h1>
        <div className="text-sm text-slate-500">Capture daily notes and reflections</div>
        
        <button
          onClick={() => {
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
          <EmptyState title="No journal entries" description="Write your first entry to start tracking your progress." 
          />
        ) : (
          <JournalList entries={journal} onEdit={onEdit} onDelete={onDelete} />
        )}
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Entry' : 'New Entry'}>
        <div className="grid gap-3">
          <label className="text-sm">Date</label>
          <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="border rounded px-3 py-2 text-black" />
          <label className="text-sm">Content</label>
          <textarea value={content} onChange={(e)=>setContent(e.target.value)} className="border rounded px-3 py-2 h-40 text-black" />

          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setOpen(false)} className="px-3 py-2 rounded">Cancel</button>
            <button onClick={() => editing ? onUpdate() : onCreate()} className="px-3 py-2 rounded bg-brand-500 text-white">Save</button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}

