import { createServerSupabaseClient } from "../utils/supabase/server";
import ClientAccount from "./ClientAccount";

export default async function Account() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <ClientAccount user={user} />;
}
