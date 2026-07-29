

import { getSupabase } from "./supabaseClient";
import { JournalEntry } from "@/stores/useDataStore";

const supabase = getSupabase();

export async function fetchJournalForUser(userId: string) {
  const { data, error } = await supabase
    .from("journal")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message || "Failed to fetch journal entries");

  return (data || []).map((r: any) => ({
    id: String(r.id),
    date: r.date,
    content: r.content,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  })) as JournalEntry[];
}

export async function createJournalForUser(
  userId: string,
  payload: Partial<JournalEntry>
) {
  // FIXED: Explicit UUID pass kar rahe hain
  const row = {
    id: crypto.randomUUID(),
    user_id: userId,
    date: payload.date,
    content: payload.content,
  };

  const { data, error } = await supabase
    .from("journal")
    .insert([row])
    .select()
    .single();

  if (error) throw new Error(error.message || "Failed to create journal entry");

  return {
    id: String(data.id),
    date: data.date,
    content: data.content,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as JournalEntry;
}

export async function updateJournalForUser(
  id: string,
  userId: string,
  patch: Partial<JournalEntry>
) {
  const row: any = {};

  if (patch.date !== undefined) row.date = patch.date;
  if (patch.content !== undefined) row.content = patch.content;

  row.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("journal")
    .update(row)
    .match({
      id,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw new Error(error.message || "Failed to update journal entry");

  return {
    id: String(data.id),
    date: data.date,
    content: data.content,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as JournalEntry;
}

export async function deleteJournalForUser(
  id: string,
  userId: string
) {
  const { error } = await supabase
    .from("journal")
    .delete()
    .match({
      id,
      user_id: userId,
    });

  if (error) throw new Error(error.message || "Failed to delete journal entry");

  return true;
}