import React, { useEffect, useState } from "react";
import ListingCard from "../components/ListingCard";
import Ad from "../components/AdInterface";
import { createClient } from "@/app/utils/supabase/client";

interface ListingListProps {
  ads: Ad[];
}

export default function ListingList({ ads }: ListingListProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUserId(user?.id || null);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {ads.map((ad) => (
        <ListingCard key={ad.id} ad={ad} userId={userId || ""} />
      ))}
    </div>
  );
}
