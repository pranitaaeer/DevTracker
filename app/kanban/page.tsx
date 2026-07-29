

'use client';

import React, { useEffect, useState } from 'react';
import KanbanBoard from '@/components/KanbanBoard';
import Card from '@/components/Card';
import { useDataStore } from '@/stores/useDataStore';
import { useUIStore } from '@/stores/useUIStore';
import Dialog from '@/components/Dialog';
import { useUser } from '@clerk/nextjs';
import { Plus } from 'lucide-react';

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'object' && e !== null && 'message' in e) {
    return String((e as any).message);
  }
  return typeof e === 'string' ? e : 'An unexpected error occurred';
}

export default function KanbanPage() {
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  const kanban = useDataStore((s) => s.kanban ?? []);
  const loadKanban = useDataStore((s) => s.loadKanban);
  const moveCard = useDataStore((s) => s.moveCard);
  const addCard = useDataStore((s) => s.addCard);
  const updateCard = useDataStore((s) => s.updateCard);
  const deleteCard = useDataStore((s) => s.deleteCard);
  const addToast = useUIStore((s) => s.addToast);

  const [openNew, setOpenNew] = useState(false);
  const [colId, setColId] = useState('');

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [linkedProject, setLinkedProject] = useState<string | undefined>(undefined);
  const [editing, setEditing] = useState<any>(null);

  const projects = useDataStore((s) => s.projects ?? []);

  useEffect(() => {
    setMounted(true);

    if (isLoaded && user?.id) {
      loadKanban(user.id).catch((error) => {
        console.error('Kanban loading error:', error);
      });
    }
  }, [isLoaded, user?.id, loadKanban]);

  useEffect(() => {
    if (kanban.length > 0 && colId === '') {
      setColId(kanban[0].id);
    }
  }, [kanban, colId]);

  async function handleMove(fromCol: string, toCol: string, cardId: string, toIndex = 0) {
  if (!user?.id) return;
  try {
    await moveCard(user.id, fromCol, toCol, cardId, toIndex);
    addToast({ title: 'Card moved' });
  } catch (e) {
    addToast({ title: 'Move failed', description: getErrorMessage(e) });
  }
}

  async function handleDelete(columnId: string, cardId: string) {
    if (!user?.id) return;
    try {
      // Fixed: Passing user.id as the first parameter
      await deleteCard(user.id, columnId, cardId);
      addToast({ title: 'Card deleted' });
    } catch (error) {
      addToast({
        title: 'Delete failed',
        description: getErrorMessage(error),
      });
    }
  }

  async function onCreate() {
    if (!user?.id || !colId || !title.trim()) return;
    try {
      // Fixed: Passing user.id as the first parameter
      await addCard(user.id, colId, {
        title,
        description: desc,
        priority,
        dueDate: dueDate || undefined,
        projectId: linkedProject,
      });
      addToast({ title: 'Card added' });
      setOpenNew(false);
      resetForm();
    } catch (e) {
      addToast({ title: 'Create failed', description: getErrorMessage(e) });
    }
  }

  function resetForm() {
    setTitle('');
    setDesc('');
    setPriority('medium');
    setDueDate('');
    setLinkedProject(undefined);
    setEditing(null);
  }

  function onEdit(colIdParam: string, card: any) {
    setEditing({ colId: colIdParam, card });
    setColId(colIdParam);
    setTitle(card.title || '');
    setDesc(card.description || '');
    setPriority(card.priority || 'medium');
    setDueDate(card.dueDate || '');
    setLinkedProject(card.projectId || undefined);
    setOpenNew(true);
  }

  async function onUpdate() {
    if (!editing || !user?.id) return;
    try {
      // Fixed: Passing user.id as the first parameter and using await
      await updateCard(user.id, editing.card.id, {
        title,
        description: desc,
        priority,
        dueDate: dueDate || undefined,
        projectId: linkedProject,
      });
      addToast({ title: 'Card updated' });
      resetForm();
      setOpenNew(false);
    } catch (e) {
      addToast({ title: 'Update failed', description: getErrorMessage(e) });
    }
  }

  if (!mounted || !isLoaded) {
    return null;
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Kanban</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              resetForm();
              setColId(kanban[0]?.id || '');
              setOpenNew(true);
            }}
            disabled={!user}
            className="flex items-center gap-2 rounded-xl bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 text-sm font-semibold transition hover:scale-105 disabled:opacity-50"
          >
            <Plus size={17} />
             New Card
          </button>
        </div>
      </div>

      <Card>
        <div className="overflow-auto">
          <KanbanBoard
            columns={kanban}
            onMove={handleMove}
            onDeleteCard={handleDelete}
            onEditCard={onEdit}
          />
        </div>
      </Card>

      <Dialog open={openNew} onClose={() => setOpenNew(false)} title={editing ? 'Edit Card' : 'New Card'}>
        <div className="grid gap-3 py-1">
          <label className="text-sm font-medium">Column</label>
          <select
            value={colId}
            onChange={(e) => setColId(e.target.value)}
            className="border text-black dark:text-white dark:bg-zinc-900 rounded-xl px-3 py-2 text-sm"
          >
            {(kanban ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <label className="text-sm font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border text-black dark:text-white dark:bg-zinc-900 rounded-xl px-3 py-2 text-sm"
          />

          <label className="text-sm font-medium">Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="border text-black dark:text-white dark:bg-zinc-900 rounded-xl px-3 py-2 text-sm resize-none h-20"
          />

          <label className="text-sm font-medium">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="border text-black dark:text-white dark:bg-zinc-900 rounded-xl px-3 py-2 text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <label className="text-sm font-medium">Due date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border rounded-xl px-3 py-2 text-black dark:text-white dark:bg-zinc-900 text-sm"
          />

          <label className="text-sm font-medium">Linked project (optional)</label>
          <select
            value={linkedProject || ''}
            onChange={(e) => setLinkedProject(e.target.value || undefined)}
            className="border rounded-xl px-3 py-2 text-black dark:text-white dark:bg-zinc-900 text-sm"
          >
            <option value="">-- None --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => setOpenNew(false)}
              className="px-3 py-2 rounded-lg text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              onClick={() => (editing ? onUpdate() : onCreate())}
              className="px-4 py-2 rounded-lg bg-brand-500 text-white text-sm"
            >
              {editing ? 'Save' : 'Create'}
            </button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}