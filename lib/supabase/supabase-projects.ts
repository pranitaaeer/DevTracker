import { getSupabase } from './supabaseClient';
import { Project } from '@/stores/useDataStore';


export async function fetchProjectsForUser(userId: string) {
const supabase = getSupabase();

  const { data, error } = await supabase.from('projects').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((r: any) => ({
    id: String(r.id),
    name: r.name,
    description: r.description || undefined,
    techStack: r.tech_stack || [],
    status: r.status || 'active',
    githubUrl: r.github_url || undefined,
    liveUrl: r.live_url || undefined,
    color: r.color || undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  })) as Project[];
}

export async function createProjectForUser(userId: string, payload: Partial<Project>) {
const supabase = getSupabase();

  const row = {
    id: payload.id ?? crypto.randomUUID(),
    user_id: userId,
    name: payload.name,
    description: payload.description || null,
    tech_stack: payload.techStack || [],
    status: payload.status || 'active',
    github_url: payload.githubUrl || null,
    live_url: payload.liveUrl || null,
    color: payload.color || null,
    created_at: payload.createdAt || new Date().toISOString(),
    updated_at: payload.updatedAt || new Date().toISOString(),
  } as any;

  const { data, error } = await supabase.from('projects').insert([row]).select().single();
  if (error) throw error;
  return {
    id: String(data.id),
    name: data.name,
    description: data.description || undefined,
    techStack: data.tech_stack || [],
    status: data.status || 'active',
    githubUrl: data.github_url || undefined,
    liveUrl: data.live_url || undefined,
    color: data.color || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as Project;
}

export async function updateProjectForUser(id: string, userId: string, patch: Partial<Project>) {
const supabase = getSupabase();

  const row: any = {};
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.description !== undefined) row.description = patch.description;
  if (patch.techStack !== undefined) row.tech_stack = patch.techStack;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.githubUrl !== undefined) row.github_url = patch.githubUrl;
  if (patch.liveUrl !== undefined) row.live_url = patch.liveUrl;
  if (patch.color !== undefined) row.color = patch.color;
  row.updated_at = new Date().toISOString();

  const { data, error } = await supabase.from('projects').update(row).match({ id, user_id: userId }).select().single();
  if (error) throw error;
  return {
    id: String(data.id),
    name: data.name,
    description: data.description || undefined,
    techStack: data.tech_stack || [],
    status: data.status || 'active',
    githubUrl: data.github_url || undefined,
    liveUrl: data.live_url || undefined,
    color: data.color || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as Project;
}

export async function deleteProjectForUser(id: string, userId: string) {
const supabase = getSupabase();

  const { data, error } = await supabase.from('projects').delete().match({ id, user_id: userId });
  if (error) throw error;
  return true;
}
