import { getSupabase } from './supabaseClient';
import { Interview } from '@/stores/useDataStore';

const supabase = getSupabase();

export async function fetchInterviewsForUser(userId: string) {
  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((r:any)=>({
    id: r.id,
    company: r.company,
    role: r.role,
    date: r.date,
    status: r.status,
    notes: r.notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  }));
}

export async function createInterviewForUser(
  userId:string,
  payload: Partial<Interview>
){
  const row = {
    id: crypto.randomUUID(),
    user_id: userId,
    company: payload.company,
    role: payload.role,
    date: payload.date,
    status: payload.status,
    notes: payload.notes
  };

  const { data, error } = await supabase
    .from('interviews')
    .insert([row])
    .select()
    .single();

  if(error) throw error;

  return {
    id: data.id,
    company: data.company,
    role: data.role,
    date: data.date,
    status: data.status,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}