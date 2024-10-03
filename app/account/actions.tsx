"use server";

import { createServerSupabaseClient } from "../utils/supabase/server";

const getUser = async () => {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting user:", error);
    return;
  } else {
    return data;
  }
};

export default getUser;
