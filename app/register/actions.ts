"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "../utils/supabase/server";

export async function signup(formData: FormData) {
  const supabase = createServerSupabaseClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  console.log(data);

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: "https://semesterbyte.se/welcome",
    },
  });

  console.log(error);

  if (error) {
    // redirect("/error");
    return { error: JSON.stringify(error, null, 2) };
  }

  // revalidatePath("/", "layout");
  // redirect("/");

  return { success: true };
}
