// HomeExchangePage.tsx
"use client";

import React, { useEffect, useState } from "react";
import ListingList from "./ListingList";
import AdMap from "../components/AdMap";
import { createClient } from "../utils/supabase/client";

// Define the shape of each ad
interface Ad {
  id: string;
  property_description: string;
  area_description: string;
  address: string;
  city: string;
  country: string;
  latitude: number;  // assuming lat and lng are stored in the database
  longitude: number;
  image_urls: string[];
}

const HomeExchangePage: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);  // Explicitly set the type for ads
  const supabase = createClient();

  // Fetch ads data from Supabase
  useEffect(() => {
    const fetchAds = async () => {
      const { data: adsData, error } = await supabase.from("ads").select("*");
      if (error) {
        console.error("Error fetching ads:", error);
      } else {
        setAds(adsData as Ad[]);  // Type assertion to help TypeScript recognize adsData as Ad[]
      }
    };

    fetchAds();
  }, [supabase]);

  return (
    <div className="flex flex-col p-8 max-w-screen-xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">
        Utforska annonser
      </h1>
      <div className="flex flex-grow gap-4">
        {/* Left section for ListingList */}
        <div className="flex-1">
          <ListingList />
        </div>

        {/* Right section for AdMap */}
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">
            Karta
          </h1>
          <AdMap ads={ads} />
        </div>
      </div>
    </div>
  );
};

export default HomeExchangePage;
