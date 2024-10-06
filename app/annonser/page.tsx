"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DateRange } from "react-day-picker";
import ListingList from "./ListingList";
import FilterBar from "./FilterBar";
import { fetchListings } from "./fetchListings";
import Ad from "../components/AdInterface";
import { useClient } from "../ClientProvider";

const AdMapNoSSR = dynamic(() => import("../components/AdMap"), { ssr: false });

export default function HomeExchangePage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
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

    loadAds();
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
          // Check if the ad's availability period overlaps with the selected date range
          return adStart <= dateRange.to && adEnd >= fromDate;
        } else {
          // If only the from date is selected
          // Check if the ad is available on or after the selected date
          return adEnd >= fromDate;
        }
      });
      setFilteredAds(filtered);
    } else {
      // If no date range is selected, show all ads
      setFilteredAds(ads);
    }
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-2xl text-primary font-bold p-4">Utforska annonser</h1>

      <div className="flex justify-center p-4 bg-gray-100">
        <div className="w-full max-w-4xl">
          <FilterBar
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            onFilterApply={applyFilter}
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-7/12 overflow-y-auto p-4">
          <ListingList ads={filteredAds} />
        </div>
        <div className="w-5/12 relative">
          <div className="absolute inset-0">
            <AdMapNoSSR ads={filteredAds} />
          </div>
        </div>
      </div>
    </div>
  );
}
