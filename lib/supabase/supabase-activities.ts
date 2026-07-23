import { getSupabase } from "./supabaseClient";
import { Activity } from "@/stores/useDataStore";

const supabase = getSupabase();

export async function fetchActivitiesForUser(userId: string) {
    const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map((r: any) => ({
        id:r.id,
        title: r.title,
        notes: r.notes,
        durationMin: r.duration_min,
        tags: r.tags ?? [],
        occurredAt: r.occurred_at,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
    })) as Activity[];
}

export async function createActivityForUser(
    userId: string,
    payload: Partial<Activity>
) {
   const row = {
  id: crypto.randomUUID(),
  user_id: userId,
  project_id: payload.projectId ?? null,

  title: payload.title,
  notes: payload.notes ?? null,
  duration_min: payload.durationMin,
  tags: payload.tags ?? [],
  occurred_at: payload.occurredAt,
};

    const { data, error } = await supabase
        .from("activities")
        .insert([row])
        .select()
        .single();

    if (error) throw error;

    return {
        id: String(data.id),
        title: data.title,
        notes: data.notes,
        durationMin: data.duration_min,
        tags: data.tags ?? [],
        occurredAt: data.occurred_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    } as Activity;
}