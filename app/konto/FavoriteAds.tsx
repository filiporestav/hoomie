"use client";

import React, { useEffect, useState } from "react";
import ListingList from "../annonser/ListingList";
import { createClient } from "../utils/supabase/client";
import Ad from "../components/AdInterface";

interface FavoriteAdsProps {
  userId: string;
}

export default function FavoriteAds({ userId }: FavoriteAdsProps) {
  const [favoriteAds, setFavoriteAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();
  useEffect(() => {
    const fetchFavoriteAds = async () => {
      setLoading(true);
      try {
        // First, fetch the favorite ad IDs
        const { data: favoriteData, error: favoriteError } = await supabase
          .from("favorites")
          .select("ad_id")
          .eq("user_id", userId);

        if (favoriteError) {
          console.error("Error fetching favorite ad IDs:", favoriteError);
          setLoading(false);
          return;
        }

        if (!favoriteData || favoriteData.length === 0) {
          setFavoriteAds([]);
          setLoading(false);
          return;
        }

        const favoriteAdIds = favoriteData.map((favorite) => favorite.ad_id);

        // Then, fetch the ads corresponding to those IDs
        const { data: adsData, error: adsError } = await supabase
          .from("ads")
          .select("*")
          .in("id", favoriteAdIds);

        if (adsError) {
          console.error("Error fetching favorite ads:", adsError);
        } else {
          setFavoriteAds(adsData || []);
        }
      } catch (error) {
        console.error("Error fetching favorite ads:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFavoriteAds();
    }
  }, [userId]);

  if (loading) return <div>Laddar...</div>;

  if (favoriteAds.length === 0) {
    return (
      <div className="text-center">Du har inga favoritmarkerade annonser.</div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center">Mina favoriter</h2>
      <ListingList ads={favoriteAds} />
    </div>
  );
}
