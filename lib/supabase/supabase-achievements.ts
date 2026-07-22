import { getSupabase } from "./supabaseClient";
import { Achievement } from "@/stores/useDataStore";

const supabase = getSupabase();

export async function fetchAchievementsForUser(userId: string) {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw error;

  return (data || []).map((r: any) => ({
    id: String(r.id),
    title: r.title,
    date: r.date,
    description: r.description || undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  })) as Achievement[];
}

export async function createAchievementForUser(
  userId: string,
  payload: Partial<Achievement>
) {
 const row = {
  id: crypto.randomUUID(),
  user_id: userId,
  title: payload.title,
  description: payload.description || null,
  date: payload.date,
};

  const { data, error } = await supabase
    .from("achievements")
    .insert([row])
    .select()
    .single();

  if (error) throw error;

  return {
    id: String(data.id),
    title: data.title,
    date: data.date,
    description: data.description || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as Achievement;
}

export async function updateAchievementForUser(
  id: string,
  userId: string,
  patch: Partial<Achievement>
) {
  const row: any = {};

  if (patch.title !== undefined) row.title = patch.title;
  if (patch.description !== undefined)
    row.description = patch.description;
  if (patch.date !== undefined) row.date = patch.date;

  row.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("achievements")
    .update(row)
    .match({
      id,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: String(data.id),
    title: data.title,
    date: data.date,
    description: data.description || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as Achievement;
}

export async function deleteAchievementForUser(
  id: string,
  userId: string
) {
  const { error } = await supabase
    .from("achievements")
    .delete()
    .match({
      id,
      user_id: userId,
    });

  if (error) throw error;

  return true;
}