'use client';
import { create } from 'zustand';
import {
  fetchInterviewsForUser,
  createInterviewForUser
} from '@/lib/supabase/supabase-interviews';
// Data models
export type Project = { id: string; name: string; description?: string; techStack?: string[]; status?: 'active' | 'on-hold' | 'completed' | 'archived'; githubUrl?: string; liveUrl?: string; color?: string; createdAt: string; updatedAt: string };
export type KanbanCard = { id: string; title: string; description?: string; projectId?: string; priority?: 'low' | 'medium' | 'high'; dueDate?: string; createdAt: string; updatedAt: string };
export type KanbanColumn = { id: string; title: string; cards: KanbanCard[] };
export type JournalEntry = { id: string; date: string; content: string; createdAt: string; updatedAt: string };
export type Interview = { id: string; company: string; role: string; date: string; status: string; notes?: string; createdAt: string; updatedAt: string };
export type Achievement = { id: string; title: string; date: string; description?: string; createdAt: string; updatedAt: string };
export type AITask = { id: string; title: string; details?: string; createdAt: string; updatedAt: string };
export type Activity = { id: string; userId: string; projectId?: string; type: string; durationMin: number; description?: string; createdAt: string };

type DevState = {
  projects: Project[];
  kanban: KanbanColumn[];
  journal: JournalEntry[];
  interviews: Interview[];
  achievements: Achievement[];
  aiTasks: AITask[];
  activities: Activity[];

  // CRUD actions
  loadProjects: (userId: string) => Promise<void>;
  loadKanban: (userId: string) => Promise<void>;
loadInterviews: (userId: string) => Promise<void>;
  addProject: (p: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Project>;
  updateProject: (id: string, patch: Partial<Project>) => Promise<Project | null>;
  deleteProject: (id: string, opts?: { undo?: boolean }) => void;
  restoreProject: (id: string) => Project | null;

  addCard: (columnId: string, card: Omit<KanbanCard, 'id' | 'createdAt' | 'updatedAt'>) => Promise<KanbanCard>;
  moveCard: (fromCol: string, toCol: string, cardId: string, toIndex?: number) => Promise<void>;
  updateCard: (cardId: string, patch: Partial<KanbanCard>) => Promise<void>;
  deleteCard: (columnId: string, cardId: string) => Promise<void>;

  // deleteCard: (columnId: string, cardId: string) => void;
  restoreCard: (cardId: string, columnId: string) => KanbanCard | null;

  addColumn: (title: string) => Promise<KanbanColumn>;
  updateColumn: (id: string, patch: Partial<KanbanColumn>) => Promise<void>;
  deleteColumn: (id: string) => Promise<void>;

  addJournal: (e: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => JournalEntry;
  updateJournal: (id: string, patch: Partial<JournalEntry>) => void;
  deleteJournal: (id: string) => void;

  // addInterview: (i: Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>) => Interview;
  addInterview: (
  i: Omit<Interview, "id" | "createdAt" | "updatedAt">
) => Promise<Interview>;
  updateInterview: (id: string, patch: Partial<Interview>) => void;
  deleteInterview: (id: string) => void;

  addAchievement: (a: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>) => Achievement;
  updateAchievement: (id: string, patch: Partial<Achievement>) => void;
  deleteAchievement: (id: string) => void;

  addAITask: (t: Omit<AITask, 'id' | 'createdAt' | 'updatedAt'>) => AITask;
  updateAITask: (id: string, patch: Partial<AITask>) => void;
  deleteAITask: (id: string) => void;

  addActivity: (a: Omit<Activity, 'id' | 'createdAt'>) => Activity;

  // utilities
  resetToMockData: () => void;
};

const STORAGE_KEY = 'devtrack_data_v1';

function nowISO() { return new Date().toISOString(); }
function uid(prefix = '') { return prefix + Math.random().toString(36).slice(2, 9); }

import { mockUser, mockActivities, mockJournal, mockKanban, mockInterviews, mockAchievements, mockAITasks } from '@/lib/mockData';

import { fetchProjectsForUser, createProjectForUser, updateProjectForUser, deleteProjectForUser } from '@/lib/supabase/supabase-projects';
import { fetchKanbanForUser, createCardForUser, updateCardForUser, deleteCardForUser, moveCardForUser, createColumnForUser, updateColumnForUser, deleteColumnForUser } from '@/lib/supabase/supabase-kanban';

function seed() {
  const projects: any[] = [];

  const kanban = mockKanban.columns.map((c: any) => ({ id: c.id, title: c.title, cards: (c.cards || []).map((card: any) => ({ id: card.id || uid('c-'), title: card.title, description: card.description || '', createdAt: nowISO(), updatedAt: nowISO() })) }));

  const journal = mockJournal.map(j => ({ ...j, id: j.id || uid('j-'), createdAt: nowISO(), updatedAt: nowISO() }));

  const interviews = mockInterviews.map(i => ({ ...i, id: i.id || uid('iv-'), createdAt: nowISO(), updatedAt: nowISO() }));

  const achievements = mockAchievements.map(a => ({ ...a, id: a.id || uid('ach-'), createdAt: nowISO(), updatedAt: nowISO() }));

  const aiTasks = mockAITasks.map(t => ({ ...t, id: t.id || uid('ai-'), createdAt: nowISO(), updatedAt: nowISO() }));

  const activities = mockActivities.map(a => ({ ...a, id: a.id || uid('act-'), createdAt: a.createdAt ?? nowISO() }));

  return { projects, kanban, journal, interviews, achievements, aiTasks, activities };
}

export const useDataStore = create<DevState>((set, get) => {
  // initialize from localStorage or seed
  let initial: any = null;
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) initial = JSON.parse(raw);
  } catch (e) { initial = null; }
  if (!initial) initial = seed();

  // persist helper
  function persist(state: any) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { console.warn('Persist failed', e); }
  }

  // setup periodic save
  const baseState = {
    // projects will be loaded from Supabase; start empty to avoid localStorage being source of truth
    projects: [],
    kanban: initial.kanban ?? [],
    journal: initial.journal,
    interviews: initial.interviews,
    achievements: initial.achievements,
    aiTasks: initial.aiTasks,
    activities: initial.activities,
  };

  // subscribe persistence for all modules EXCEPT projects and kanban (these are stored in Supabase)
  setTimeout(() => {
    // subscribe will run only in client runtime
    (useDataStore as any).subscribe((state: any) => {
      const snapshot = {
        // omit projects and kanban to avoid localStorage being the source of truth for them
        journal: state.journal,
        interviews: state.interviews,
        achievements: state.achievements,
        aiTasks: state.aiTasks,
        activities: state.activities
      };
      persist(snapshot);
    });
  }, 100);

  // pending deletes for undo
  const pendingDeletes: { [key: string]: any } = {};

  return {
    ...baseState,

    // load projects from Supabase for the provided user
    loadProjects: async (userId: string) => {
      try {
        const rows = await fetchProjectsForUser(userId);
        set((s: any) => ({ projects: rows }));
      } catch (e: any) {
        console.error('Failed to load projects from Supabase', e);
      }
    },

    // load kanban columns and cards for the provided user
    // loadKanban: async (userId: string) => {
    //   try {
    //     const rows = await fetchKanbanForUser(userId);
    //     set((s: any) => ({ kanban: rows }));
    //   } catch (e: any) {
    //     console.error('Failed to load kanban from Supabase', e);
    //   }
    // },
    loadKanban: async (userId: string) => {
      try {
        const rows = await fetchKanbanForUser(userId);

        set({
          kanban: Array.isArray(rows) ? rows : []
        });

      } catch (e) {
        console.error(e);

        set({
          kanban: []
        });
      }
    },
    loadInterviews: async (userId: string) => {
      const rows = await fetchInterviewsForUser(userId);

      set({
        interviews: rows
      });
    },
    addProject: async (p) => {
      // create on Supabase first
      try {
        const created = await createProjectForUser((mockUser as any).id, p as any);
        set((s: any) => ({ projects: [created, ...s.projects] }));
        return created;
      } catch (e: any) {
        console.log("err increating project", e)
        // fallback: create locally
        const project: Project = {
          id: uid('proj-'),
          name: p.name,
          description: p.description,
          techStack: (p as any).techStack || [],
          status: (p as any).status || 'active',
          githubUrl: (p as any).githubUrl || undefined,
          liveUrl: (p as any).liveUrl || undefined,
          color: p.color || 'bg-slate-400',
          createdAt: nowISO(),
          updatedAt: nowISO()
        };
        set((s: any) => ({ projects: [project, ...s.projects] }));
        return project;
      }
    },

    restoreProject: (id) => {
      const key = 'proj:' + id;
      // @ts-ignore pendingDeletes exists in closure
      if (!pendingDeletes[key]) return null;
      const payload = pendingDeletes[key].payload;
      delete pendingDeletes[key];
      set((s: any) => ({ projects: [payload, ...s.projects] }));
      return payload;
    },

    updateProject: async (id, patch) => {
      try {
        const updated = await updateProjectForUser(id, (mockUser as any).id, patch as any);
        set((s: any) => ({ projects: s.projects.map((pr: Project) => pr.id === id ? updated : pr) }));
        return updated;
      } catch (e: any) {
        console.error('updateProject failed', e);
        // fallback local update
        let updated: Project | null = null;
        set((s: any) => ({ projects: s.projects.map((pr: Project) => { if (pr.id === id) { updated = { ...pr, ...patch, updatedAt: nowISO() }; return updated; } return pr; }) }));
        return updated;
      }
    },

    deleteProject: (id, opts) => {
      const state = get();
      const project = state.projects.find(p => p.id === id);
      if (!project) return;
      // optimistic remove
      set((s: any) => ({ projects: s.projects.filter((p: Project) => p.id !== id) }));
      // schedule final deletion after 5s unless undone
      const key = 'proj:' + id;
      pendingDeletes[key] = { type: 'project', payload: project };
      setTimeout(async () => {
        if (!pendingDeletes[key]) return; // restored
        try {
          await deleteProjectForUser(id, (mockUser as any).id);
        } catch (e: any) {
          console.error('Supabase delete failed', e);
        }
        delete pendingDeletes[key];
      }, 5000);
    },


    addCard: async (columnId, card) => {
      // optimistic
      const newCard: KanbanCard = { id: uid('card-'), title: card.title, description: card.description || '', projectId: (card as any).projectId || undefined, priority: (card as any).priority || 'medium', dueDate: (card as any).dueDate || undefined, createdAt: nowISO(), updatedAt: nowISO() };
      set((s: any) => ({ kanban: s.kanban.map((col: KanbanColumn) => col.id === columnId ? { ...col, cards: [newCard, ...col.cards] } : col) }));
      try {
        const created = await createCardForUser((mockUser as any).id, columnId, newCard as any);
        // replace optimistic card with canonical created
        set((s: any) => ({ kanban: s.kanban.map((col: KanbanColumn) => ({ ...col, cards: col.cards.map(c => c.id === newCard.id ? created : c) })) }));
        return created;
      } catch (e: any) {
        // rollback
        set((s: any) => ({ kanban: s.kanban.map((col: KanbanColumn) => ({ ...col, cards: col.cards.filter(c => c.id !== newCard.id) })) }));
        throw e;
      }
    },

    moveCard: async (fromCol, toCol, cardId, toIndex = 0) => {
      // optimistic local move
      set((s: any) => {
        const cols = JSON.parse(JSON.stringify(s.kanban)) as KanbanColumn[];
        let moved: KanbanCard | null = null;
        for (const col of cols) {
          const idx = col.cards.findIndex(c => c.id === cardId);
          if (idx >= 0) { moved = col.cards.splice(idx, 1)[0]; break; }
        }
        if (!moved) return { kanban: s.kanban };
        const target = cols.find(c => c.id === toCol);
        if (!target) return { kanban: cols };
        target.cards.splice(toIndex, 0, { ...moved, updatedAt: nowISO() });
        return { kanban: cols };
      });

      try {
        await moveCardForUser(cardId, (mockUser as any).id, toCol, toIndex);
      } catch (e: any) {
        // rollback by reloading kanban from Supabase
        try { const rows = await fetchKanbanForUser((mockUser as any).id); set((s: any) => ({ kanban: rows })); } catch (e2) { console.error('rollback failed', e2); }
        throw e;
      }
    },
    updateCard: async (cardId, patch) => {
      // optimistic update
      let previous: KanbanCard | null = null;
      set((s: any) => ({ kanban: s.kanban.map((col: KanbanColumn) => ({ ...col, cards: col.cards.map(c => { if (c.id === cardId) { previous = { ...c }; return { ...c, ...patch, updatedAt: nowISO() }; } return c; }) })) }));
      try {
        const updated = await updateCardForUser(cardId, (mockUser as any).id, patch as any);
        // ensure canonical updated
        set((s: any) => ({ kanban: s.kanban.map((col: KanbanColumn) => ({ ...col, cards: col.cards.map(c => c.id === cardId ? updated : c) })) }));
      } catch (e: any) {
        // rollback
        if (previous) {
          set((s: any) => ({ kanban: s.kanban.map((col: KanbanColumn) => ({ ...col, cards: col.cards.map(c => c.id === cardId ? previous as any : c) })) }));
        }
        throw e;
      }
    },


    deleteCard: async (columnId, cardId) => {

      const state = get();

      const column = state.kanban.find(
        (c) => c.id === columnId
      );

      if (!column) return;

      const card = column.cards.find(
        (c) => c.id === cardId
      );

      if (!card) return;


      // remove UI
      set((state) => ({
        kanban: state.kanban.map((col) =>
          col.id === columnId
            ? {
              ...col,
              cards: col.cards.filter(
                c => c.id !== cardId
              )
            }
            : col
        )
      }));


      // delete database
      try {

        await deleteCardForUser(
          cardId,
          mockUser.id
        );

      } catch (error) {

        console.error(
          "Delete card failed",
          error
        );

        // reload if failed
        await get().loadKanban(mockUser.id);

        throw error;
      }

    },
    restoreCard: (cardId, columnId) => {
      const key = 'card:' + cardId;
      // @ts-ignore
      if (!pendingDeletes[key]) return null;
      // @ts-ignore
      const payload = pendingDeletes[key].payload as KanbanCard;
      delete pendingDeletes[key];
      set((s: any) => ({ kanban: s.kanban.map((col: KanbanColumn) => col.id === columnId ? { ...col, cards: [payload, ...col.cards] } : col) }));
      return payload;
    },
    addColumn: async (title) => {
      // optimistic
      const col: KanbanColumn = { id: uid('col-'), title, cards: [] };
      set((s: any) => ({ kanban: [...s.kanban, col] }));
      try {
        const created = await createColumnForUser((mockUser as any).id, title);
        set((s: any) => ({ kanban: s.kanban.map((c: KanbanColumn) => c.id === col.id ? created : c) }));
        return created;
      } catch (e: any) {
        // rollback
        set((s: any) => ({ kanban: s.kanban.filter((c: KanbanColumn) => c.id !== col.id) }));
        throw e;
      }
    },
    updateColumn: async (id, patch) => {
      let previousTitle: string | null = null;
      set((s: any) => ({ kanban: s.kanban.map((c: KanbanColumn) => { if (c.id === id) { previousTitle = c.title; return { ...c, ...patch }; } return c; }) }));
      try {
        await updateColumnForUser(id, (mockUser as any).id, patch as any);
      } catch (e: any) {
        // rollback
        if (previousTitle !== null) set((s: any) => ({ kanban: s.kanban.map((c: KanbanColumn) => c.id === id ? { ...c, title: previousTitle! } : c) }));
        throw e;
      }
    },
    deleteColumn: async (id) => {
      const state = get();
      const col = state.kanban.find((c: KanbanColumn) => c.id === id);
      if (!col) return;
      set((s: any) => ({ kanban: s.kanban.filter((c: KanbanColumn) => c.id !== id) }));
      try {
        await deleteColumnForUser(id, (mockUser as any).id);
      } catch (e: any) {
        // rollback
        set((s: any) => ({ kanban: [...s.kanban, col] }));
        throw e;
      }
    },

    addJournal: (e) => {
      const entry: JournalEntry = { id: uid('j-'), date: e.date, content: e.content, createdAt: nowISO(), updatedAt: nowISO() };
      set((s: any) => ({ journal: [entry, ...s.journal] }));
      return entry;
    },
    updateJournal: (id, patch) => { set((s: any) => ({ journal: s.journal.map((j: JournalEntry) => j.id === id ? { ...j, ...patch, updatedAt: nowISO() } : j) })); },
    deleteJournal: (id) => { set((s: any) => ({ journal: s.journal.filter((j: JournalEntry) => j.id !== id) })); },

   addInterview: async (i) => {

  const created = await createInterviewForUser(
      mockUser.id,
      i
  );

  set((s:any)=>({
      interviews:[created,...s.interviews]
  }));

  return created;
},
    updateInterview: (id, patch) => { set((s: any) => ({ interviews: s.interviews.map((it: Interview) => it.id === id ? { ...it, ...patch, updatedAt: nowISO() } : it) })); },
    deleteInterview: (id) => { set((s: any) => ({ interviews: s.interviews.filter((it: Interview) => it.id !== id) })); },

    addAchievement: (a) => { const ach: Achievement = { id: uid('ach-'), ...a, createdAt: nowISO(), updatedAt: nowISO() }; set((s: any) => ({ achievements: [ach, ...s.achievements] })); return ach; },
    updateAchievement: (id, patch) => { set((s: any) => ({ achievements: s.achievements.map((a: Achievement) => a.id === id ? { ...a, ...patch, updatedAt: nowISO() } : a) })); },
    deleteAchievement: (id) => { set((s: any) => ({ achievements: s.achievements.filter((a: Achievement) => a.id !== id) })); },

    addAITask: (t) => { const task: AITask = { id: uid('ai-'), ...t, createdAt: nowISO(), updatedAt: nowISO() }; set((s: any) => ({ aiTasks: [task, ...s.aiTasks] })); return task; },
    updateAITask: (id, patch) => { set((s: any) => ({ aiTasks: s.aiTasks.map((t: AITask) => t.id === id ? { ...t, ...patch, updatedAt: nowISO() } : t) })); },
    deleteAITask: (id) => { set((s: any) => ({ aiTasks: s.aiTasks.filter((t: AITask) => t.id !== id) })); },

    addActivity: (a) => { const act: Activity = { id: uid('act-'), ...a, createdAt: nowISO() }; set((s: any) => ({ activities: [act, ...s.activities] })); return act; },

    resetToMockData: () => {
      const s = seed();
      set({ projects: s.projects, kanban: s.kanban, journal: s.journal, interviews: s.interviews, achievements: s.achievements, aiTasks: s.aiTasks, activities: s.activities });
    }
  } as DevState;
});
