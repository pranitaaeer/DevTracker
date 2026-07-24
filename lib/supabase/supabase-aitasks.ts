import { getSupabase } from "./supabaseClient";
import { AITask } from "@/stores/useDataStore";

const supabase = getSupabase();

export async function fetchAITasksForUser(userId: string) {
  const { data, error } = await supabase
    .from("ai_tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((r: any) => ({
    id: r.id,
    title: r.title,
    details: r.details,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  })) as AITask[];
}
export async function createAITaskForUser(
  userId: string,
  payload: Partial<AITask>
) {
  const row = {
    id: crypto.randomUUID(),
    user_id: userId,
    title: payload.title,
    details: payload.details ?? null,
    status: "pending",
  };

  const { data, error } = await supabase
    .from("ai_tasks")
    .insert([row])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    details: data.details,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as AITask;
}
export async function updateAITaskStatus(
  id: string,
  status: "pending" | "completed" | "dismissed"
) {
  const { data, error } = await supabase
    .from("ai_tasks")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    details: data.details,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as AITask;
}