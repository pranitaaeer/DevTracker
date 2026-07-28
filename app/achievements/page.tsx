// 'use client';

// import React, { useEffect, useState } from 'react';
// import { Trophy, Plus, Pencil, Trash2 } from 'lucide-react';
// import AchievementsList from '@/components/AchievementsList';
// import Card from '@/components/Card';
// import EmptyState from '@/components/EmptyState';
// import Dialog from '@/components/Dialog';
// import { useDataStore } from '@/stores/useDataStore';
// import { useUIStore } from '@/stores/useUIStore';
// import { mockUser } from '@/lib/mockData';

// export default function AchievementsPage() {
//   const [mounted, setMounted] = useState(false);

//   const items = useDataStore((s) => s.achievements ?? []);
//   const addAchievement = useDataStore((s) => s.addAchievement);
//   const updateAchievement = useDataStore((s) => s.updateAchievement);
//   const deleteAchievement = useDataStore((s) => s.deleteAchievement);
//   const loadAchievements = useDataStore((s) => s.loadAchievements);
//   const addToast = useUIStore((s) => s.addToast);

//   const [open, setOpen] = useState(false);
//   const [editing, setEditing] = useState<any>(null);
//   const [title, setTitle] = useState('');
//   const [date, setDate] = useState('');
//   const [desc, setDesc] = useState('');

//   useEffect(() => {
//     setMounted(true);
//     loadAchievements(mockUser.id);
//   }, [loadAchievements]);

//   function resetForm() {
//     setTitle('');
//     setDate('');
//     setDesc('');
//     setEditing(null);
//   }

//   async function onCreate() {
//     if (!title) return;
//     try {
//       await addAchievement({ title, date, description: desc });
//       addToast({ title: 'Achievement added' });
//       setOpen(false);
//       resetForm();
//     } catch (e) {
//       addToast({ title: 'Failed to add achievement', description: String(e) });
//     }
//   }

//   function onEdit(item: any) {
//     setEditing(item);
//     setTitle(item.title);
//     setDate(item.date);
//     setDesc(item.description || '');
//     setOpen(true);
//   }

//   async function onUpdate() {
//     if (!editing) return;
//     try {
//       await updateAchievement(editing.id, {
//         title,
//         date,
//         description: desc,
//       });
//       addToast({ title: 'Achievement updated' });
//       setOpen(false);
//       resetForm();
//     } catch (e) {
//       addToast({ title: 'Failed to update achievement', description: String(e) });
//     }
//   }

//   async function onDelete(id: string) {
//     try {
//       await deleteAchievement(id);
//       addToast({ title: 'Achievement removed' });
//     } catch (e) {
//       addToast({ title: 'Delete failed', description: String(e) });
//     }
//   }

//   // Prevent hydration mismatch
//   if (!mounted) return null;

//   return (
//     <main className="p-6 max-w-6xl mx-auto">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//         <div>
//           <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm font-medium">
//             <Trophy size={16} className="text-amber-500 dark:text-amber-400" />
//             Developer Growth
//           </div>

//           <h1 className="text-3xl font-bold mt-1 text-zinc-900 dark:text-white">
//             Achievements
//           </h1>

//           <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
//             Track milestones, badges and important wins.
//           </p>
//         </div>

//         <button
//           onClick={() => {
//             resetForm();
//             setOpen(true);
//           }}
//           className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2.5 text-sm font-semibold transition hover:scale-105 shadow-sm"
//         >
//           <Plus size={17} />
//          + Add Achievement
//         </button>
//       </div>

//       {/* Main Card */}
//       <Card title="Milestones">
//         {items.length === 0 ? (
//           <EmptyState
//             title="No achievements yet"
//             description="Complete goals and reach milestones to unlock achievements."
//             action={
//               <button
//                 onClick={() => {
//                   resetForm();
//                   setOpen(true);
//                 }}
//                 className="px-3 py-2 rounded bg-brand-500 text-white"
//               >
//                 Create achievement
//               </button>
//             }
//           />
//         ) : (
//           <div className="space-y-6">
//             <AchievementsList items={items} />

//             <div className="grid gap-3">
//               {items.map((item) => (
//                 <div
//                   key={item.id}
//                   className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 dark:hover:border-zinc-700"
//                 >
//                   <div>
//                     <h3 className="font-semibold text-zinc-900 dark:text-white">
//                       {item.title}
//                     </h3>

//                     <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">
//                       {item.date}
//                     </p>

//                     {item.description && (
//                       <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
//                         {item.description}
//                       </p>
//                     )}
//                   </div>

//                   <div className="flex gap-2 shrink-0">
//                     <button
//                       onClick={() => onEdit(item)}
//                       className="h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition"
//                     >
//                       <Pencil size={15} />
//                     </button>

//                     <button
//                       onClick={() => onDelete(item.id)}
//                       className="h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition flex items-center justify-center"
//                     >
//                       <Trash2 size={15} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </Card>

//       {/* Dialog Modal */}
//       <Dialog
//         open={open}
//         onClose={() => setOpen(false)}
//         title={editing ? 'Edit Achievement' : 'New Achievement'}
//       >
//         <div className="grid gap-4 py-1 text-zinc-800 dark:text-zinc-200">
//           <div className="grid gap-1.5">
//             <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
//               Title
//             </label>
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Achievement title..."
//               className="w-full border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition placeholder:text-zinc-400"
//             />
//           </div>

//           <div className="grid gap-1.5">
//             <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
//               Date
//             </label>
//             <input
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               className="w-full border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition [color-scheme:dark]"
//             />
//           </div>

//           <div className="grid gap-1.5">
//             <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
//               Description
//             </label>
//             <textarea
//               value={desc}
//               onChange={(e) => setDesc(e.target.value)}
//               placeholder="Description of the milestone or award..."
//               rows={4}
//               className="w-full border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition placeholder:text-zinc-400 resize-none"
//             />
//           </div>

//           <div className="flex justify-end gap-2.5 mt-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
//             <button
//               onClick={() => setOpen(false)}
//               className="px-3 py-2 rounded"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={() => (editing ? onUpdate() : onCreate())}
//               className="px-3 py-2 rounded bg-brand-500 text-white"
//             >
//               {editing ? 'Save Changes' : 'Create '}
//             </button>
//           </div>
//         </div>
//       </Dialog>
//     </main>
//   );
// }

'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Plus, Pencil, Trash2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import AchievementsList from '@/components/AchievementsList';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import Dialog from '@/components/Dialog';
import { useDataStore } from '@/stores/useDataStore';
import { useUIStore } from '@/stores/useUIStore';

export default function AchievementsPage() {
  const [mounted, setMounted] = useState(false);
  const { user, isLoaded } = useUser();

  const items = useDataStore((s) => s.achievements ?? []);
  const addAchievement = useDataStore((s) => s.addAchievement);
  const updateAchievement = useDataStore((s) => s.updateAchievement);
  const deleteAchievement = useDataStore((s) => s.deleteAchievement);
  const loadAchievements = useDataStore((s) => s.loadAchievements);
  const addToast = useUIStore((s) => s.addToast);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoaded && user?.id) {
      loadAchievements(user.id);
    }
  }, [isLoaded, user?.id, loadAchievements]);

  function resetForm() {
    setTitle('');
    setDate('');
    setDesc('');
    setEditing(null);
  }

  async function onCreate() {
    if (!title || !user?.id) return;
    setSubmitting(true);
    try {
      // FIX 1: Pass user.id as the first argument
      await addAchievement(user.id, {
        title,
        date,
        description: desc,
      });
      addToast({ title: 'Achievement added' });
      setOpen(false);
      resetForm();
    } catch (e) {
      addToast({ title: 'Failed to add achievement', description: String(e) });
    } finally {
      setSubmitting(false);
    }
  }

  function onEdit(item: any) {
    setEditing(item);
    setTitle(item.title || '');
    setDate(item.date || '');
    setDesc(item.description || '');
    setOpen(true);
  }

  async function onUpdate() {
    if (!editing || !user?.id) return;
    setSubmitting(true);
    try {
      // FIX 2: Pass user.id as the first argument, followed by id and patch
      await updateAchievement(user.id, editing.id, {
        title,
        date,
        description: desc,
      });
      addToast({ title: 'Achievement updated' });
      setOpen(false);
      resetForm();
    } catch (e) {
      addToast({ title: 'Failed to update achievement', description: String(e) });
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id: string) {
    if (!user?.id) return;
    try {
      // FIX 3: Pass user.id as the first argument, followed by id
      await deleteAchievement(user.id, id);
      addToast({ title: 'Achievement removed' });
    } catch (e) {
      addToast({ title: 'Delete failed', description: String(e) });
    }
  }

  if (!mounted || !isLoaded) return null;

  return (
    <main className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm font-medium">
            <Trophy size={16} className="text-amber-500 dark:text-amber-400" />
            Developer Growth
          </div>

          <h1 className="text-3xl font-bold mt-1 text-zinc-900 dark:text-white">
            Achievements
          </h1>

          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
            Track milestones, badges and important wins.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          disabled={!user}
          className="flex items-center justify-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2.5 text-sm font-semibold transition hover:scale-105 shadow-sm disabled:opacity-50"
        >
          <Plus size={17} />
          Add Achievement
        </button>
      </div>

      {/* Main Card */}
      <Card title="Milestones">
        {items.length === 0 ? (
          <EmptyState
            title="No achievements yet"
            description="Complete goals and reach milestones to unlock achievements."
            action={
              <button
                onClick={() => {
                  resetForm();
                  setOpen(true);
                }}
                className="px-3 py-2 rounded bg-brand-500 text-white"
              >
                Create achievement
              </button>
            }
          />
        ) : (
          <div className="space-y-6">
            <AchievementsList items={items} />

            <div className="grid gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 dark:hover:border-zinc-700"
                >
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white">
                      {item.title}
                    </h3>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">
                      {item.date}
                    </p>

                    {item.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => onEdit(item)}
                      className="h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      onClick={() => onDelete(item.id)}
                      className="h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition flex items-center justify-center"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Dialog Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Achievement' : 'New Achievement'}
      >
        <div className="grid gap-4 py-1 text-zinc-800 dark:text-zinc-200">
          <div className="grid gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Achievement title..."
              className="w-full border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition placeholder:text-zinc-400"
            />
          </div>

          <div className="grid gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition [color-scheme:dark]"
            />
          </div>

          <div className="grid gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Description
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description of the milestone or award..."
              rows={4}
              className="w-full border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition placeholder:text-zinc-400 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2.5 mt-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={submitting || !title.trim()}
              onClick={() => (editing ? onUpdate() : onCreate())}
              className="px-3 py-2 rounded bg-brand-500 text-white text-sm disabled:opacity-50 transition"
            >
              {submitting ? 'Saving...' : editing ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </div>
      </Dialog>
    </main>
  );
}