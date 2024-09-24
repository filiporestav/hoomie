import AccountForm from "./profileData/account-form";
import AdsContainer from "./adsData/adsContainer";
import { createClient } from "../utils/supabase/server";

export default async function Account() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-indigo-900 mb-8">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AccountForm user={user} />
        <AdsContainer user={user} />
      </div>
    </div>
  );
}