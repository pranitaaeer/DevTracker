

'use client';

import { create } from 'zustand';
import {
  fetchInterviewsForUser,
  createInterviewForUser,
  updateInterviewForUser,
  deleteInterviewForUser,
} from '@/lib/supabase/supabase-interviews';
import {
  fetchAchievementsForUser,
  createAchievementForUser,
  updateAchievementForUser,
  deleteAchievementForUser,
} from '@/lib/supabase/supabase-achievements';
import {
  fetchJournalForUser,
  createJournalForUser,
  updateJournalForUser,
  deleteJournalForUser,
} from '@/lib/supabase/supabase-journals';
import {
  fetchActivitiesForUser,
  createActivityForUser,
} from '@/lib/supabase/supabase-activities';
import {
  fetchAITasksForUser,
  createAITaskForUser,
  updateAITaskStatus as updateAITaskStatusApi,
} from '@/lib/supabase/supabase-aitasks';
import {
  mockActivities,
  mockJournal,
  mockKanban,
  mockInterviews,
  mockAchievements,
} from '@/lib/mockData';
import {
  fetchProjectsForUser,
  createProjectForUser,
  updateProjectForUser,
  deleteProjectForUser,
} from '@/lib/supabase/supabase-projects';
import {
  fetchKanbanForUser,
  createCardForUser,
  updateCardForUser,
  deleteCardForUser,
  moveCardForUser,
  createColumnForUser,
  updateColumnForUser,
  deleteColumnForUser,
} from '@/lib/supabase/supabase-kanban';

export type Project = {
  id: string;
  name: string;
  description?: string;
  techStack?: string[];
  status?: 'active' | 'on-hold' | 'completed' | 'archived';
  githubUrl?: string;
  liveUrl?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
};

export type KanbanCard = {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};

export type KanbanColumn = {
  id: string;
  title: string;
  cards: KanbanCard[];
};

export type JournalEntry = {
  id: string;
  date: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type Interview = {
  id: string;
  company: string;
  role: string;
  date: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Achievement = {
  id: string;
  title: string;
  date: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type AITask = {
  id: string;
  title: string;
  details?: string;
  status?: 'pending' | 'completed' | 'dismissed';
  createdAt: string;
  updatedAt: string;
};

export type Activity = {
  id: string;
  userId: string;
  projectId?: string;
  title: string;
  notes?: string;
  durationMin: number;
  tags: string[];
  occurredAt: string;
  createdAt: string;
  updatedAt: string;
};

type DevState = {
  projects: Project[];
  kanban: KanbanColumn[];
  journal: JournalEntry[];
  interviews: Interview[];
  achievements: Achievement[];
  aiTasks: AITask[];
  activities: Activity[];

  loadAllUserData: (userId: string) => Promise<void>;

  loadProjects: (userId: string) => Promise<void>;
  loadKanban: (userId: string) => Promise<void>;
  loadInterviews: (userId: string) => Promise<void>;
  loadAchievements: (userId: string) => Promise<void>;
  loadJournal: (userId: string) => Promise<void>;
  loadActivities: (userId: string) => Promise<void>;
  loadAITasks: (userId: string) => Promise<void>;

  addProject: (userId: string, p: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Project>;
  updateProject: (userId: string, id: string, patch: Partial<Project>) => Promise<Project | null>;
  deleteProject: (userId: string, id: string) => void;
  restoreProject: (id: string) => Project | null;

  addCard: (userId: string, columnId: string, card: Omit<KanbanCard, 'id' | 'createdAt' | 'updatedAt'>) => Promise<KanbanCard>;
  moveCard: (userId: string, fromCol: string, toCol: string, cardId: string, toIndex?: number) => Promise<void>;
  updateCard: (userId: string, cardId: string, patch: Partial<KanbanCard>) => Promise<void>;
  deleteCard: (userId: string, columnId: string, cardId: string) => Promise<void>;
  restoreCard: (cardId: string, columnId: string) => KanbanCard | null;

  addColumn: (userId: string, title: string) => Promise<KanbanColumn>;
  updateColumn: (userId: string, id: string, patch: Partial<KanbanColumn>) => Promise<void>;
  deleteColumn: (userId: string, id: string) => Promise<void>;

  addJournal: (userId: string, e: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<JournalEntry>;
  updateJournal: (userId: string, id: string, patch: Partial<JournalEntry>) => Promise<void>;
  deleteJournal: (userId: string, id: string) => Promise<void>;

  addInterview: (userId: string, i: Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Interview>;
  updateInterview: (userId: string, id: string, patch: Partial<Interview>) => Promise<void>;
  deleteInterview: (userId: string, id: string) => Promise<void>;

  addAchievement: (userId: string, a: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Achievement>;
  updateAchievement: (userId: string, id: string, patch: Partial<Achievement>) => Promise<void>;
  deleteAchievement: (userId: string, id: string) => Promise<void>;

  generateAITask: (userId: string) => Promise<AITask>;
  updateAITaskStatus: (id: string, status: 'pending' | 'completed' | 'dismissed') => Promise<void>;

  addActivity: (userId: string, a: Omit<Activity, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<Activity>;

  resetToMockData: () => void;
};

const STORAGE_KEY = 'devtrack_data_v1';

function nowISO() {
  return new Date().toISOString();
}

function uid(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 9);
}

function seed() {
  const projects: any[] = [];
  const kanban = mockKanban.columns.map((c: any) => ({
    id: c.id,
    title: c.title,
    cards: (c.cards || []).map((card: any) => ({
      id: card.id || uid('c-'),
      title: card.title,
      description: card.description || '',
      createdAt: nowISO(),
      updatedAt: nowISO(),
    })),
  }));
  const journal = mockJournal.map((j) => ({ ...j, id: j.id || uid('j-'), createdAt: nowISO(), updatedAt: nowISO() }));
  const interviews = mockInterviews.map((i) => ({ ...i, id: i.id || uid('iv-'), createdAt: nowISO(), updatedAt: nowISO() }));
  const achievements = mockAchievements.map((a) => ({ ...a, id: a.id || uid('ach-'), createdAt: nowISO(), updatedAt: nowISO() }));
  const aiTasks: AITask[] = [];
  const activities = mockActivities.map((a) => ({ ...a, id: a.id || uid('act-'), createdAt: a.createdAt ?? nowISO() }));

  return { projects, kanban, journal, interviews, achievements, aiTasks, activities };
}

export const useDataStore = create<DevState>((set, get) => {
  let initial: any = null;
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) initial = JSON.parse(raw);
  } catch (e) {
    initial = null;
  }
  if (!initial) initial = seed();

  const baseState = {
    projects: [],
    kanban: initial.kanban ?? [],
    journal: initial.journal ?? [],
    interviews: initial.interviews ?? [],
    achievements: initial.achievements ?? [],
    aiTasks: [],
    activities: initial.activities ?? [],
  };

  const pendingDeletes: { [key: string]: any } = {};

  return {
    ...baseState,

    loadAllUserData: async (userId: string) => {
      const { loadProjects, loadKanban, loadInterviews, loadJournal, loadActivities, loadAITasks, loadAchievements } = get();
      await Promise.all([
        loadProjects(userId),
        loadKanban(userId),
        loadInterviews(userId),
        loadJournal(userId),
        loadActivities(userId),
        loadAITasks(userId),
        loadAchievements(userId),
      ]);
    },

    loadProjects: async (userId: string) => {
      try {
        const data = await fetchProjectsForUser(userId);
        set({ projects: data });
      } catch (e) {
        console.error("Failed to fetch projects from Supabase", e);
      }
    },

    loadKanban: async (userId: string) => {
      try {
        const rows = await fetchKanbanForUser(userId);

        // Agar user ke paas pehle se columns hain, toh woh set kar do
        if (Array.isArray(rows) && rows.length > 0) {
          set({ kanban: rows });
        } else {
          // AGAR 0 COLUMNS HAIN (Naya User): Toh pehle 3 default columns bana do
          console.log("No columns found. Creating default columns...");

          const { addColumn } = get();
          await addColumn(userId, 'To Do');
          await addColumn(userId, 'In Progress');
          await addColumn(userId, 'Done');
        }
      } catch (e) {
        console.error('Failed to load kanban', e);
        set({ kanban: [] });
      }
    },

    loadInterviews: async (userId: string) => {
      const rows = await fetchInterviewsForUser(userId);
      set({ interviews: rows });
    },

    loadJournal: async (userId: string) => {
      const rows = await fetchJournalForUser(userId);
      set({ journal: rows });
    },

    loadActivities: async (userId: string) => {
      const rows = await fetchActivitiesForUser(userId);
      set({ activities: rows });
    },

    loadAITasks: async (userId: string) => {
      const rows = await fetchAITasksForUser(userId);
      set({ aiTasks: rows });
    },

    loadAchievements: async (userId: string) => {
      const rows = await fetchAchievementsForUser(userId);
      set({ achievements: rows });
    },

    addProject: async (userId: string, p: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
      try {
        // 1. Supabase database mein record create kar rahe hain
        const newProject = await createProjectForUser(userId, p);

        // 2. Clear aur fresh sync ke liye Supabase se latest list fetch kar rahe hain
        const updatedList = await fetchProjectsForUser(userId);
        set({ projects: updatedList });

        return newProject;
      } catch (e) {
        console.error("Failed to create project in Supabase", e);
        throw e;
      }
    },

    updateProject: async (userId: string, id: string, patch: Partial<Project>) => {
      try {
        // 1. Supabase mein record update kar rahe hain
        const updated = await updateProjectForUser(id, userId, patch);

        // 2. UI State Update
        const current = get().projects;
        set({
          projects: current.map((p) => (p.id === id ? { ...p, ...updated } : p)),
        });

        return updated;
      } catch (e) {
        console.error("Failed to update project in Supabase", e);
        throw e;
      }
    },
    deleteProject: async (userId: string, id: string) => {
      try {
        // 1. Supabase se record delete kar rahe hain
        await deleteProjectForUser(id, userId);

        // 2. UI State Update
        const current = get().projects;
        set({ projects: current.filter((p) => p.id !== id) });
      } catch (e) {
        console.error("Failed to delete project from Supabase", e);
        throw e;
      }
    },
    restoreProject: (id) => {
      const key = 'proj:' + id;
      if (!pendingDeletes[key]) return null;
      const payload = pendingDeletes[key].payload;
      delete pendingDeletes[key];
      set((s) => ({ projects: [payload, ...s.projects] }));
      return payload;
    },

    addCard: async (userId, columnId, card) => {
      const newCard: KanbanCard = {
        id: uid('card-'),
        title: card.title,
        description: card.description || '',
        projectId: card.projectId,
        priority: card.priority || 'medium',
        dueDate: card.dueDate,
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };
      set((s) => ({
        kanban: s.kanban.map((col) => (col.id === columnId ? { ...col, cards: [newCard, ...col.cards] } : col)),
      }));
      try {
        const created = await createCardForUser(userId, columnId, newCard as any);
        set((s) => ({
          kanban: s.kanban.map((col) => ({ ...col, cards: col.cards.map((c) => (c.id === newCard.id ? created : c)) })),
        }));
        return created;
      } catch (e) {
        set((s) => ({
          kanban: s.kanban.map((col) => ({ ...col, cards: col.cards.filter((c) => c.id !== newCard.id) })),
        }));
        throw e;
      }
    },

    moveCard: async (userId, fromCol, toCol, cardId, toIndex = 0) => {
      set((s) => {
        const cols = JSON.parse(JSON.stringify(s.kanban)) as KanbanColumn[];
        let moved: KanbanCard | null = null;
        for (const col of cols) {
          const idx = col.cards.findIndex((c) => c.id === cardId);
          if (idx >= 0) {
            moved = col.cards.splice(idx, 1)[0];
            break;
          }
        }
        if (!moved) return { kanban: s.kanban };
        const target = cols.find((c) => c.id === toCol);
        if (!target) return { kanban: cols };
        target.cards.splice(toIndex, 0, { ...moved, updatedAt: nowISO() });
        return { kanban: cols };
      });

      try {
        await moveCardForUser(cardId, userId, toCol, toIndex);
      } catch (e) {
        try {
          const rows = await fetchKanbanForUser(userId);
          set({ kanban: rows });
        } catch (e2) {
          console.error('Rollback failed', e2);
        }
        throw e;
      }
    },

    updateCard: async (userId, cardId, patch) => {
      let previous: KanbanCard | null = null;
      set((s) => ({
        kanban: s.kanban.map((col) => ({
          ...col,
          cards: col.cards.map((c) => {
            if (c.id === cardId) {
              previous = { ...c };
              return { ...c, ...patch, updatedAt: nowISO() };
            }
            return c;
          }),
        })),
      }));
      try {
        const updated = await updateCardForUser(cardId, userId, patch as any);
        set((s) => ({
          kanban: s.kanban.map((col) => ({ ...col, cards: col.cards.map((c) => (c.id === cardId ? updated : c)) })),
        }));
      } catch (e) {
        if (previous) {
          set((s) => ({
            kanban: s.kanban.map((col) => ({ ...col, cards: col.cards.map((c) => (c.id === cardId ? (previous as any) : c)) })),
          }));
        }
        throw e;
      }
    },

    deleteCard: async (userId, columnId, cardId) => {
      const state = get();
      const column = state.kanban.find((c) => c.id === columnId);
      if (!column) return;
      const card = column.cards.find((c) => c.id === cardId);
      if (!card) return;

      set((s) => ({
        kanban: s.kanban.map((col) => (col.id === columnId ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) } : col)),
      }));

      try {
        await deleteCardForUser(cardId, userId);
      } catch (error) {
        await get().loadKanban(userId);
        throw error;
      }
    },

    restoreCard: (cardId, columnId) => {
      const key = 'card:' + cardId;
      if (!pendingDeletes[key]) return null;
      const payload = pendingDeletes[key].payload as KanbanCard;
      delete pendingDeletes[key];
      set((s) => ({
        kanban: s.kanban.map((col) => (col.id === columnId ? { ...col, cards: [payload, ...col.cards] } : col)),
      }));
      return payload;
    },

    addColumn: async (userId, title) => {
      const col: KanbanColumn = { id: uid('col-'), title, cards: [] };
      set((s) => ({ kanban: [...s.kanban, col] }));
      try {
        const created = await createColumnForUser(userId, title);
        set((s) => ({ kanban: s.kanban.map((c) => (c.id === col.id ? created : c)) }));
        return created;
      } catch (e) {
        set((s) => ({ kanban: s.kanban.filter((c) => c.id !== col.id) }));
        throw e;
      }
    },

    updateColumn: async (userId, id, patch) => {
      let previousTitle: string | null = null;
      set((s) => ({
        kanban: s.kanban.map((c) => {
          if (c.id === id) {
            previousTitle = c.title;
            return { ...c, ...patch };
          }
          return c;
        }),
      }));
      try {
        await updateColumnForUser(id, userId, patch as any);
      } catch (e) {
        if (previousTitle !== null) {
          set((s) => ({ kanban: s.kanban.map((c) => (c.id === id ? { ...c, title: previousTitle! } : c)) }));
        }
        throw e;
      }
    },

    deleteColumn: async (userId, id) => {
      const state = get();
      const col = state.kanban.find((c) => c.id === id);
      if (!col) return;
      set((s) => ({ kanban: s.kanban.filter((c) => c.id !== id) }));
      try {
        await deleteColumnForUser(id, userId);
      } catch (e) {
        set((s) => ({ kanban: [...s.kanban, col] }));
        throw e;
      }
    },

    addJournal: async (userId, e) => {
      const created = await createJournalForUser(userId, e);
      set((s) => ({ journal: [created, ...s.journal] }));
      return created;
    },

    updateJournal: async (userId, id, patch) => {
      const updated = await updateJournalForUser(id, userId, patch);
      set((s) => ({ journal: s.journal.map((j) => (j.id === id ? updated : j)) }));
    },

    deleteJournal: async (userId, id) => {
      await deleteJournalForUser(id, userId);
      set((s) => ({ journal: s.journal.filter((j) => j.id !== id) }));
    },

    addInterview: async (userId, i) => {
      const created = await createInterviewForUser(userId, i);
      set((s) => ({ interviews: [created, ...s.interviews] }));
      return created;
    },

    updateInterview: async (userId, id, patch) => {
      const updated = await updateInterviewForUser(id, userId, patch);
      set((s) => ({ interviews: s.interviews.map((it) => (it.id === id ? updated : it)) }));
    },

    deleteInterview: async (userId, id) => {
      await deleteInterviewForUser(id, userId);
      set((s) => ({ interviews: s.interviews.filter((it) => it.id !== id) }));
    },

    addAchievement: async (userId, a) => {
      const created = await createAchievementForUser(userId, a);
      set((s) => ({ achievements: [created, ...s.achievements] }));
      return created;
    },

    updateAchievement: async (userId, id, patch) => {
      const updated = await updateAchievementForUser(id, userId, patch);
      set((s) => ({ achievements: s.achievements.map((a) => (a.id === id ? updated : a)) }));
    },

    deleteAchievement: async (userId, id) => {
      await deleteAchievementForUser(id, userId);
      set((s) => ({ achievements: s.achievements.filter((a) => a.id !== id) }));
    },

    generateAITask: async (userId) => {
      const activities = get().activities.slice(0, 10);
      const response = await fetch('/api/ai/generate-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activities }),
      });

      if (!response.ok) throw new Error('AI generation failed');
      const suggestion = await response.json();

      const created = await createAITaskForUser(userId, {
        title: suggestion.title,
        details: suggestion.details,
      });

      set((s) => ({ aiTasks: [created, ...s.aiTasks] }));
      return created;
    },

    updateAITaskStatus: async (id, status) => {
      const updated = await updateAITaskStatusApi(id, status);
      set((s) => ({ aiTasks: s.aiTasks.map((t) => (t.id === id ? updated : t)) }));
    },

    addActivity: async (userId, a) => {
      const created = await createActivityForUser(userId, {
        title: a.title,
        notes: a.notes,
        durationMin: a.durationMin,
        tags: a.tags,
        occurredAt: a.occurredAt,
        projectId: a.projectId,
      });
      set((s) => ({ activities: [created, ...s.activities] }));
      return created;
    },

    resetToMockData: () => {
      const s = seed();
      set({
        projects: s.projects,
        kanban: s.kanban,
        journal: s.journal,
        interviews: s.interviews,
        achievements: s.achievements,
        aiTasks: [],
      });
    },
  };
});