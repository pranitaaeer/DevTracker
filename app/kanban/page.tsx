'use client';

import React, { useEffect, useState } from 'react';
import KanbanBoard from '@/components/KanbanBoard';
import Card from '@/components/Card';
import { useDataStore } from '@/stores/useDataStore';
import { useUIStore } from '@/stores/useUIStore';
import Dialog from '@/components/Dialog';
import { MOCK_USER_ID } from '@/lib/mockData';

export default function KanbanPage() {
  // Hydration safety flag
  const [mounted, setMounted] = useState(false);

  const kanban = useDataStore((s) => s.kanban ?? []);
  const loadKanban = useDataStore((s) => (s as any).loadKanban);
  const moveCard = useDataStore((s) => s.moveCard);
  const addCard = useDataStore((s) => s.addCard);
  const updateCard = useDataStore((s) => s.updateCard);
  const deleteCard = useDataStore((s) => s.deleteCard);
  const restoreCard = useDataStore((s) => (s as any).restoreCard);
  const addColumn = useDataStore((s) => (s as any).addColumn);
  const updateColumn = useDataStore((s) => (s as any).updateColumn);
  const deleteColumn = useDataStore((s) => (s as any).deleteColumn);
  const openConfirm = useUIStore((s) => s.openConfirm);
  const addToast = useUIStore((s) => s.addToast);

  const [openNew, setOpenNew] = useState(false);
  const [colId, setColId] = useState('');

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [linkedProject, setLinkedProject] = useState<string | undefined>(undefined);
  const [editing, setEditing] = useState<any>(null);
  
  // Use Zustand selector for reactive subscriptions
  const projects = useDataStore((s) => s.projects ?? []);

  useEffect(() => {
    setMounted(true);

    async function fetchKanban() {
      try {
        await loadKanban(MOCK_USER_ID);
      } catch (error) {
        console.log('Kanban loading error:', error);
      }
    }

    fetchKanban();
  }, [loadKanban]);

  useEffect(() => {
    if (kanban.length > 0 && colId === '') {
      setColId(kanban[0].id);
    }
  }, [kanban, colId]);

  async function handleMove(fromCol: string, toCol: string, cardId: string, toIndex = 0) {
    try {
      await moveCard(fromCol, toCol, cardId, toIndex);
      addToast({ title: 'Card moved' });
    } catch (e) {
      addToast({ title: 'Move failed', description: String(e) });
    }
  }

  async function handleDelete(colId: string, cardId: string) {
    try {
      await deleteCard(colId, cardId);
      addToast({ title: 'Card deleted' });
    } catch (error) {
      console.error(error);
      addToast({
        title: 'Delete failed',
        description: String(error),
      });
    }
  }

  async function onCreate() {
    if (!colId || !title) return;
    try {
      await addCard(colId, {
        title,
        description: desc,
        priority,
        dueDate: dueDate || undefined,
        projectId: linkedProject,
      });
      addToast({ title: 'Card added' });
      setOpenNew(false);
      setTitle('');
      setDesc('');
      setPriority('medium');
      setDueDate('');
      setLinkedProject(undefined);
    } catch (e) {
      addToast({ title: 'Create failed', description: String(e) });
    }
  }

  function onEdit(colIdParam: string, card: any) {
    setEditing({ colId: colIdParam, card });
    setColId(colIdParam);
    setTitle(card.title);
    setDesc(card.description || '');
    setPriority(card.priority || 'medium');
    setDueDate(card.dueDate || '');
    setLinkedProject(card.projectId || undefined);
    setOpenNew(true);
  }

  function onUpdate() {
    if (!editing) return;
    updateCard(editing.card.id, {
      title,
      description: desc,
      priority,
      dueDate: dueDate || undefined,
      projectId: linkedProject,
    });
    addToast({ title: 'Card updated' });
    setEditing(null);
    setOpenNew(false);
  }

  // Prevent server vs client HTML mismatch during initial render
  if (!mounted) {
    return null;
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Kanban</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setOpenNew(true);
              setEditing(null);
              setTitle('');
              setDesc('');
              setPriority('medium');
              setDueDate('');
              setLinkedProject(undefined);
              setColId(kanban[0]?.id || '');
            }}
            className="flex items-center gap-2 rounded-xl bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 text-sm font-semibold transition hover:scale-105"
          >
            + New Card
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
        <div className="grid gap-3">
          <label className="text-sm">Column</label>
          <select value={colId} onChange={(e) => setColId(e.target.value)} className="border text-black rounded px-3 py-2">
            {(kanban ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          <label className="text-sm">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="border text-black rounded px-3 py-2" />

          <label className="text-sm">Description</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="border text-black rounded px-3 py-2" />

          <label className="text-sm">Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="border text-black rounded px-3 py-2">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <label className="text-sm">Due date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="border rounded px-3 py-2 text-black" />

          <label className="text-sm">Linked project (optional)</label>
          <select value={linkedProject || ''} onChange={(e) => setLinkedProject(e.target.value || undefined)} className="border rounded px-3 py-2 text-black">
            <option value="">-- None --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setOpenNew(false)} className="px-3 py-2 rounded">
              Cancel
            </button>
            <button onClick={() => (editing ? onUpdate() : onCreate())} className="px-3 py-2 rounded bg-brand-500 text-white">
              {editing ? 'Save' : 'Create'}
            </button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}