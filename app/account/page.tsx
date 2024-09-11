import AccountForm from "./profileData/account-form";
import AdsContainer from "./adsData/adsContainer";
import { createClient } from "../utils/supabase/server";

export default async function Account() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex">
      {/* Left side for AccountForm */}
      <div className="w-1/2 p-4">
        <AccountForm user={user} />
      </div>

      {/* Right side for AdsContainer */}
      <div className="w-1/2 p-4">
        <AdsContainer user={user} />
      </div>
    </div>
  );
}
