'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Plus, Pencil, Trash2 } from 'lucide-react';
import AchievementsList from '@/components/AchievementsList';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import Dialog from '@/components/Dialog';
import { useDataStore } from '@/stores/useDataStore';
import { useUIStore } from '@/stores/useUIStore';
import { mockUser } from '@/lib/mockData';
export default function AchievementsPage() {
  const items = useDataStore(s => s.achievements);
  const addAchievement = useDataStore(s => s.addAchievement);
  const updateAchievement = useDataStore(s => s.updateAchievement);
  const deleteAchievement = useDataStore(s => s.deleteAchievement);
  const addToast = useUIStore(s => s.addToast);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');

  function resetForm() {
    setTitle('');
    setDate('');
    setDesc('');
    setEditing(null);
  }

  async function onCreate() {
    await addAchievement({ title, date, description: desc });
    addToast({ title: 'Achievement added' });
    setOpen(false);
    resetForm();
  }

  function onEdit(item: any) {
    setEditing(item);
    setTitle(item.title);
    setDate(item.date);
    setDesc(item.description || '');
    setOpen(true);
  }

  async function onUpdate() {
    if (!editing) return;
   await updateAchievement(editing.id, {
      title,
      date,
      description: desc
    });
    addToast({ title: 'Achievement updated' });
    setOpen(false);
    resetForm();
  }

  async function onDelete(id: string) {
   await deleteAchievement(id);
    addToast({ title: 'Achievement removed' });
  }
const loadAchievements =
  useDataStore(s => s.loadAchievements);

useEffect(() => {
  loadAchievements(mockUser.id);
}, [loadAchievements]);

  return (
    <main className="min-h-screen text-white p-6">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

        <div>
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <Trophy size={16} className="text-emerald-400" />
            Developer Growth
          </div>

          <h1 className="text-4xl font-bold mt-2">
            Achievements
          </h1>

          <p className="text-zinc-500 mt-2">
            Track milestones, badges and important wins.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <Plus size={17} />
          Add Achievement
        </button>

      </div>


      <Card title="Milestones">

        {
          items.length === 0 ?

            <EmptyState
              title="No achievements yet"
              description="Complete goals and reach milestones to unlock achievements."
            />

            :

            <div className="space-y-6">

              <AchievementsList items={items} />


              <div className="grid gap-3">

                {
                  items.map(item => (

                    <div key={item.id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#111827] px-5 py-4 transition-transform duration-200 hover:-translate-y-1">

                      <div>

                        <h3 className="font-medium text-white">
                          {item.title}
                        </h3>

                        <p className="text-sm text-zinc-500 mt-1">
                          {item.date}
                        </p>

                        {
                          item.description &&
                          <p className="text-sm text-zinc-400 mt-2">
                            {item.description}
                          </p>
                        }

                      </div>


                      <div className="flex gap-3">

                        <button
                          onClick={() => onEdit(item)}
                          className="h-9 w-9 rounded-lg border border-zinc-700 flex items-center justify-center hover:bg-zinc-800"
                        >
                          <Pencil size={15} />
                        </button>


                        <button
                          onClick={() => onDelete(item.id)}
                          className="h-9 w-9 rounded-lg border border-red-900 text-red-400 flex items-center justify-center hover:bg-red-950"
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>


                    </div>

                  ))
                }

              </div>

            </div>

        }

      </Card>



      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Achievement' : 'New Achievement'}
      >

        <div className="grid gap-4">

          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Achievement title"
            className="rounded-xl border border-zinc-700 bg-[#0d1117] px-4 py-3 text-white outline-none focus:border-emerald-500"
          />


          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="rounded-xl border border-zinc-700 bg-[#0d1117] px-4 py-3 text-white outline-none focus:border-emerald-500"
          />


          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Description"
            rows={4}
            className="rounded-xl border border-zinc-700 bg-[#0d1117] px-4 py-3 text-white outline-none focus:border-emerald-500"
          />


          <div className="flex justify-end gap-3 mt-2">

            <button
              onClick={() => setOpen(false)}
              className="rounded-xl border border-zinc-700 px-5 py-2 hover:bg-zinc-800"
            >
              Cancel
            </button>


            <button
              onClick={() => editing ? onUpdate() : onCreate()}
              className="rounded-xl bg-white text-black px-5 py-2 font-medium"
            >
              Save
            </button>

          </div>

        </div>

      </Dialog>


    </main>
  );
}