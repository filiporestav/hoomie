"use client";

import React, { useEffect, useState } from "react";
import ListingList from "./ListingList";
import AdMap from "../components/AdMap";
import { fetchListings } from "./fetchListings";
import Ad from "../components/AdInterface";

export default function HomeExchangePage() {
  const [ads, setAds] = useState<Ad[]>([]);

  // Fetch listings on component mount
  useEffect(() => {
    const loadAds = async () => {
      try {
        const fetchedAds = await fetchListings();
        setAds(fetchedAds);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    loadAds();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="flex h-screen">
      <div className="w-7/12 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Utforska annonser</h1>
        <ListingList ads={ads} />
      </div>
      <div className="w-5/12">
        <AdMap ads={ads} />
      </div>
    </div>
  );
}
