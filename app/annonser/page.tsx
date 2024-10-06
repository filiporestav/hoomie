"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DateRange } from "react-day-picker";
import ListingList from "./ListingList";
import FilterBar from "./FilterBar";
import { fetchListings } from "./fetchListings";
import Ad from "../components/AdInterface";
import { useClient } from "../ClientProvider";

// Dynamically import the AdMap component with SSR disabled
const AdMapNoSSR = dynamic(() => import("../components/AdMap"), { ssr: false });

export default function HomeExchangePage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const isClient = useClient();

  useEffect(() => {
    const loadAds = async () => {
      try {
        const fetchedAds = await fetchListings();
        setAds(fetchedAds);
        setFilteredAds(fetchedAds);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error("Error fetching user location:", error);
          }
        );
      } else {
        setUserLocation({ lat: 59.3293, lng: 18.0686 }); // Default to Stockholm if geolocation is not supported
        console.error("Geolocation is not supported by this browser");
      }
    };

    getUserLocation(); // Fetch user's location
    loadAds(); // Fetch listings
  }, []);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const applyFilter = () => {
    if (dateRange?.from) {
      const fromDate = dateRange.from;
      const filtered = ads.filter((ad) => {
        const adStart = new Date(ad.availability_start);
        const adEnd = new Date(ad.availability_end);

        if (dateRange.to) {
          // If both from and to dates are selected
          return adStart <= dateRange.to && adEnd >= fromDate;
        } else {
          // If only the from date is selected
          return adEnd >= fromDate;
        }
      });
      setFilteredAds(filtered);
    } else {
      setFilteredAds(ads); // If no date range is selected, show all ads
    }
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-2xl text-primary font-bold p-4">Utforska annonser</h1>

      {/* Smaller Date Picker Section */}
      <div className="flex justify-center p-2 bg-gray-100 shadow-sm">
        <div className="w-full max-w-sm flex flex-col items-center md:flex-row md:justify-between gap-2">
          <FilterBar
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            onFilterApply={applyFilter}
            className="max-w-xs"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 overflow-hidden">
        {/* Listings */}
        <div className="w-7/12 overflow-y-auto p-4">
          <ListingList ads={filteredAds} />
        </div>

        {/* Map */}
        <div className="w-5/12 relative">
          <div className="absolute inset-0">
            {userLocation ? (
              <AdMapNoSSR
                ads={filteredAds}
                latitude={userLocation.lat}
                longitude={userLocation.lng}
              />
            ) : (
              <p>Loading map...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
