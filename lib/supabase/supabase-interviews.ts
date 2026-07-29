

import { getSupabase } from "./supabaseClient";
import { Interview } from "@/stores/useDataStore";

const supabase = getSupabase();

export async function fetchInterviewsForUser(userId: string) {
  const { data, error } = await supabase
    .from("interviews")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message || "Failed to fetch interviews");

  return (data || []).map((r: any) => ({
    id: String(r.id),
    company: r.company,
    role: r.role,
    date: r.date,
    status: r.status,
    notes: r.notes || undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  })) as Interview[];
}

export async function createInterviewForUser(
  userId: string,
  payload: Partial<Interview>
) {
  // FIXED: Explicit UUID pass kar rahe hain
  const row = {
    id: crypto.randomUUID(),
    user_id: userId,
    company: payload.company,
    role: payload.role,
    date: payload.date,
    status: payload.status,
    notes: payload.notes || null,
  };

  const { data, error } = await supabase
    .from("interviews")
    .insert([row])
    .select()
    .single();

  if (error) throw new Error(error.message || "Failed to create interview");

  return {
    id: String(data.id),
    company: data.company,
    role: data.role,
    date: data.date,
    status: data.status,
    notes: data.notes || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as Interview;
}

export async function updateInterviewForUser(
  id: string,
  userId: string,
  patch: Partial<Interview>
) {
  const row: any = {};

  if (patch.company !== undefined) row.company = patch.company;
  if (patch.role !== undefined) row.role = patch.role;
  if (patch.date !== undefined) row.date = patch.date;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.notes !== undefined) row.notes = patch.notes;

  row.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("interviews")
    .update(row)
    .match({
      id,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw new Error(error.message || "Failed to update interview");

  return {
    id: String(data.id),
    company: data.company,
    role: data.role,
    date: data.date,
    status: data.status,
    notes: data.notes || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as Interview;
}

export async function deleteInterviewForUser(
  id: string,
  userId: string
) {
  const { error } = await supabase
    .from("interviews")
    .delete()
    .match({
      id,
      user_id: userId,
    });

  if (error) throw new Error(error.message || "Failed to delete interview");

  return true;
}