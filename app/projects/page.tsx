"use client"
import React, { useState } from 'react';
import ProjectsList from '@/components/ProjectsList';
import Card from '@/components/Card';
import EmptyState from '@/components/EmptyState';
import { useDataStore } from '@/stores/useDataStore';
import { useUIStore } from '@/stores/useUIStore';
import Dialog from '@/components/Dialog';
import { MOCK_USER_ID } from '@/lib/mockData';
import { useEffect } from 'react';

export default function ProjectsPage() {
  const projects = useDataStore(s => s.projects);
  const loadProjects = useDataStore(s => s.loadProjects);
  const addProject = useDataStore(s => s.addProject);
  const updateProject = useDataStore(s => s.updateProject);
  const deleteProject = useDataStore(s => s.deleteProject);
  const restoreProject = useDataStore(s => s.restoreProject);
  const addToast = useUIStore(s => s.addToast);
  const openConfirm = useUIStore(s => s.openConfirm);

  const [openNew, setOpenNew] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [viewing, setViewing] = useState<any>(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [techs, setTechs] = useState('');
  const [status, setStatus] = useState<'active' | 'on-hold' | 'completed' | 'archived'>('active');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');

  function resetForm() { setName(''); setDesc(''); setTechs(''); setStatus('active'); setGithubUrl(''); setLiveUrl(''); setEditing(null); }

  async function onCreate() {
    try {
      const p = await addProject({ name, description: desc, techStack: techs.split(',').map(t => t.trim()).filter(Boolean), status, githubUrl: githubUrl || undefined, liveUrl: liveUrl || undefined });
      addToast({ title: 'Project created', description: p.name });
      setOpenNew(false); resetForm();
    } catch (e) {
      addToast({ title: 'Project create failed', description: String(e) });
    }
  }

  async function onUpdate() {
    if (!editing) return;
    try {
      await updateProject(editing.id, { name, description: desc, techStack: techs.split(',').map(t => t.trim()).filter(Boolean), status, githubUrl: githubUrl || undefined, liveUrl: liveUrl || undefined });
      addToast({ title: 'Project updated' });
      setOpenNew(false); resetForm();
    } catch (e) {
      addToast({ title: 'Project update failed', description: String(e) });
    }
  }

  function confirmDelete(id: string) {
    openConfirm({
      title: 'Delete project', description: 'Are you sure you want to delete this project? This action can be undone within 5 seconds.', onConfirm: () => {
        deleteProject(id);
        addToast({ title: 'Project deleted', description: 'Undo', action: { label: 'Undo', onClick: () => { const restored = restoreProject(id); if (restored) addToast({ title: 'Undo successful', description: restored.name }); } } });
      }
    });
  }

  function onView(p: any) { setViewing(p); }

  useEffect(() => {
    // load projects from Supabase when page mounts
    loadProjects(MOCK_USER_ID).catch((e) => console.error('Failed loading projects', e));
  }, []);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <div className="flex gap-2">
          <button
           onClick={() => { 
            setOpenNew(true); 
            resetForm(); }} 
                className="flex items-center gap-2 rounded-xl bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 text-sm font-semibold transition hover:scale-105">

             + New Project</button>
        </div>
      </div>

      <Card>
        {projects.length === 0 ? (
          <EmptyState title="No projects yet" description="Create a project to organize your work and track activities." action={<button onClick={() => setOpenNew(true)} className="px-3 py-2 bg-brand-500 text-white rounded">Create project</button>} />
        ) : (
          <ProjectsList projects={projects} onEdit={(p) => { setEditing(p); setName(p.name); setDesc(p.description || ''); setTechs((p.techStack || []).join(', ')); setStatus(p.status || 'active'); setGithubUrl(p.githubUrl || ''); setLiveUrl(p.liveUrl || ''); setOpenNew(true); }} onDelete={confirmDelete} onView={onView} />
        )}
      </Card>

      <Dialog open={openNew} onClose={() => setOpenNew(false)} title={editing ? 'Edit Project' : 'New Project'}>
        <div className="grid gap-3">
          <label className="text-sm">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="border rounded px-3 py-2 text-black" />
          <label className="text-sm">Description</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="border rounded px-3 py-2 text-black" />

          <label className="text-sm">Tech stack (comma separated)</label>
          <input value={techs} onChange={(e) => setTechs(e.target.value)} className="border rounded px-3 py-2 text-black" />

          <label className="text-sm">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="border rounded px-3 py-2 text-black">
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>

          <label className="text-sm">GitHub URL</label>
          <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="border rounded px-3 py-2 text-black" />

          <label className="text-sm">Live URL</label>
          <input value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} className="border rounded px-3 py-2 text-black" />

          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => { setOpenNew(false); resetForm(); }} className="px-3 py-2 rounded">Cancel</button>
            <button onClick={() => editing ? onUpdate() : onCreate()} className="px-3 py-2 rounded bg-brand-500 text-white">{editing ? 'Save' : 'Create'}</button>
          </div>
        </div>
      </Dialog>

      <Dialog open={!!viewing} onClose={() => setViewing(null)} title={viewing ? viewing.name : 'Project'}>
        {viewing && (
          <div className="grid gap-3">
            <p className="text-sm text-zinc-400">{viewing.description || 'No description provided.'}</p>
            <div className="flex gap-2 flex-wrap">
              {(viewing.techStack || []).map((t: string) => <span key={t} className="px-2 py-1 text-xs bg-zinc-800 rounded">{t}</span>)}
            </div>
            <div className="mt-2 text-sm text-zinc-400">
              <div><strong>Status:</strong> {viewing.status}</div>
              {viewing.githubUrl && <div><strong>GitHub:</strong> <a href={viewing.githubUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline">{viewing.githubUrl}</a></div>}
              {viewing.liveUrl && <div><strong>Live:</strong> <a href={viewing.liveUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline">{viewing.liveUrl}</a></div>}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => { setViewing(null); setEditing(viewing); setName(viewing.name); setDesc(viewing.description || ''); setTechs((viewing.techStack || []).join(', ')); setStatus(viewing.status || 'active'); setGithubUrl(viewing.githubUrl || ''); setLiveUrl(viewing.liveUrl || ''); setOpenNew(true); }} className="px-3 py-2 rounded border">Edit</button>
              <button onClick={() => { setViewing(null); confirmDelete(viewing.id); }} className="px-3 py-2 rounded bg-red-600 text-white">Delete</button>
            </div>
          </div>
        )}
      </Dialog>
    </main>
  );
}
