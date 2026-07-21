"use client"

import React, { useState } from 'react';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import Dialog from '@/components/Dialog';
import { useDataStore } from '@/stores/useDataStore';
import { useUIStore } from '@/stores/useUIStore';

export default function AITasksPage() {
  const tasks = useDataStore(s=>s.aiTasks);
  const addTask = useDataStore(s=>s.addAITask);
  const updateTask = useDataStore(s=>s.updateAITask);
  const deleteTask = useDataStore(s=>s.deleteAITask);
  const addToast = useUIStore(s=>s.addToast);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');

  function onCreate() {
    addTask({ title, details });
    addToast({ title: 'Task added' });
    setOpen(false); setTitle(''); setDetails('');
  }

  const [editing, setEditing] = useState<any>(null);

  function onEdit(t:any) { setEditing(t); setTitle(t.title); setDetails(t.details || ''); setOpen(true); }
  function onDelete(id:string) { deleteTask(id); addToast({ title: 'Task deleted' }); }
  function onSave() { if (editing) { updateTask(editing.id, { title, details }); addToast({ title: 'Task updated' }); setEditing(null); setOpen(false); setTitle(''); setDetails(''); } else { onCreate(); } }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">AI Tasks</h1>
        <div className="text-sm text-slate-500">Suggestions and automation helpers</div>
      </div>

      <Card>
        {tasks.length === 0 ? (
          <EmptyState title="No AI suggestions" description="AI will surface task suggestions based on your activity." action={<button onClick={()=>setOpen(true)} className="px-3 py-2 bg-brand-500 text-white rounded">Create Task</button>} />
        ) : (
          <ul className="space-y-3">
            {tasks.map((t) => (
              <li key={t.id} className="p-3 border rounded bg-slate-50 dark:bg-slate-800 flex items-start justify-between">
                <div>
                  <div className="font-medium">{t.title}</div>
                  <div className="text-sm text-slate-500">{t.details}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => onEdit(t)} className="text-sm text-brand-500">Edit</button>
                  <button onClick={() => onDelete(t.id)} className="text-sm text-red-500">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Dialog open={open} onClose={()=>{ setOpen(false); setEditing(null); }} title={editing ? 'Edit AI Task' : 'Create AI Task'}>
        <div className="grid gap-3">
          <label className="text-sm">Title</label>
          <input value={title} onChange={(e)=>setTitle(e.target.value)} className="border rounded px-3 py-2" />
          <label className="text-sm">Details</label>
          <textarea value={details} onChange={(e)=>setDetails(e.target.value)} className="border rounded px-3 py-2" />

          <div className="flex justify-end gap-2 mt-3">
            <button onClick={()=>{ setOpen(false); setEditing(null); }} className="px-3 py-2 rounded">Cancel</button>
            <button onClick={()=>onSave()} className="px-3 py-2 rounded bg-brand-500 text-white">{editing ? 'Save' : 'Create'}</button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}
