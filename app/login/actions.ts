"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "../utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createServerSupabaseClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  console.log(data);

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log("Error logging in:", error);
    return { error: error.message };
  }

  // revalidatePath("/", "layout");
  // redirect("/");
  return { success: true };
}
