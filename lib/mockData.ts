export const MOCK_USER_ID = 'mock-user-1';

export const mockUser = {
  id: MOCK_USER_ID,
  name: 'Dev Track User',
  email: 'dev@devtrack.local',
  bio: 'Full-stack developer building DevTrack.'
};

export const mockProjects = [
  {
    id: 'proj-1',
    name: 'DevTrack Core',
    description: 'Build the core features: Activity, Projects, Journal.',
    color: 'bg-violet-500',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'proj-2',
    name: 'Portfolio Site',
    description: 'Public portfolio and resume builder.',
    color: 'bg-sky-500',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const mockActivities = [
  { id: 'act-1', userId: MOCK_USER_ID, projectId: 'proj-1', type: 'coding', durationMin: 90, description: 'Refactored activity model', createdAt: new Date().toISOString() },
  { id: 'act-2', userId: MOCK_USER_ID, projectId: 'proj-1', type: 'meeting', durationMin: 30, description: 'Sprint planning', createdAt: new Date().toISOString() }
];

export const mockJournal = [
  { id: 'j-1', userId: MOCK_USER_ID, date: new Date().toISOString().slice(0, 10), content: 'Today I worked on Activity forms and refactoring.' }
];

export const mockKanban = {
  columns: [
    { id: 'col-1', title: 'Backlog', cards: [{ id: 'card-1', title: 'Design DB schema' }] },
    { id: 'col-2', title: 'In Progress', cards: [{ id: 'card-2', title: 'Implement Activity form' }] },
    { id: 'col-3', title: 'Done', cards: [{ id: 'card-3', title: 'Scaffold project' }] }
  ]
};

export const mockInterviews = [
  { id: 'iv-1', userId: MOCK_USER_ID, company: 'Acme', role: 'Frontend Engineer', date: '2024-08-01', status: 'scheduled', notes: '' }
];

export const mockAchievements = [
  { id: 'ach-1', title: 'Reached 30 days streak', date: '2024-07-10', description: 'Committed daily for 30 days.' }
];

export const mockAITasks = [
  { id: 'ai-1', title: 'Split large PR into smaller tasks', details: 'Break into 3 incremental PRs' }
];

export const mockAnalytics = {
  weeklyHours: [
    { day: 'Mon', hours: 4 }, { day: 'Tue', hours: 6 }, { day: 'Wed', hours: 5 }, { day: 'Thu', hours: 3 }, { day: 'Fri', hours: 7 }, { day: 'Sat', hours: 0 }, { day: 'Sun', hours: 0 }
  ]
};
