import { getSupabase } from "./supabase/supabaseClient";

const supabase = getSupabase();

export async function syncUser(user:any){

    const {data}=await supabase
    .from("users")
    .select("id")
    .eq("id",user.id)
    .maybeSingle();

    if(data) return;

    await supabase
    .from("users")
    .insert({
        id:user.id,
        username:user.fullName,
        email:user.primaryEmailAddress?.emailAddress,
        image_url:user.imageUrl
    });

}