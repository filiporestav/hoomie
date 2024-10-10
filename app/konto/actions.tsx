"use server";

import { createClient } from "../utils/supabase/server";

const getUser = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting user:", error);
    return;
  } else {
    return data;
  }
};

export default getUser;
