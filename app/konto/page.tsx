// Account.tsx
import { createClient } from "../utils/supabase/server";
import ClientAccount from "./ClientAccount";

export default async function Account() {
  // Fetch user data on component mount
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Pass the fetched user data to a client component
  return <ClientAccount user={user} />;
}
