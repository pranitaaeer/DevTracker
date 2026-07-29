
import { getSupabase } from "./supabase/supabaseClient";

const supabase = getSupabase();

export async function syncUser(user: any) {
  if (!user || !user.id) return;

  const userPayload = {
    id: user.id,
    name: user.fullName || user.firstName || "User", // ✅ 'username' ko badal kar 'name' kiya
    email: user.primaryEmailAddress?.emailAddress || "",
    image_url: user.imageUrl || null,
    updated_at: new Date().toISOString(),
  };

  // ✅ insert ki jagah upsert use karein taaki duplicate / exists checks ki wajah se error na aaye
  const { error } = await supabase
    .from("users")
    .upsert(userPayload, { onConflict: "id" });

  if (error) {
    console.log("Supabase User Sync Error:", error.message, error.details);
  }
}