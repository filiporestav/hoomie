"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DateRange } from "react-day-picker";
import ListingList from "./ListingList";
import FilterBar from "./FilterBar";
import { fetchListings } from "./fetchListings";
import Ad from "../components/AdInterface";
import { useClient } from "../ClientProvider";
import { LatLngBounds } from "leaflet";
import { Skeleton } from "@/components/ui/skeleton";

const AdMapNoSSR = dynamic(() => import("../components/AdMap"), { ssr: false });

export default function HomeExchangePage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);

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
            setIsMapLoading(false);
          },
          (error) => {
            console.error("Error fetching user location:", error);
            setUserLocation({ lat: 59.3293, lng: 18.0686 });
            setIsMapLoading(false);
          }
        );
      } else {
        setUserLocation({ lat: 59.3293, lng: 18.0686 });
        setIsMapLoading(false);
        console.error("Geolocation is not supported by this browser");
      }
    };

    getUserLocation();
    loadAds();
  }, []);

  const handleMapBoundsChange = (bounds: LatLngBounds) => {
    setMapBounds(bounds);
  };

  useEffect(() => {
    const filterAds = () => {
      let adsToFilter = ads;

      if (dateRange?.from && dateRange?.to) {
        adsToFilter = adsToFilter.filter((ad) => {
          const adStart = new Date(ad.availability_start);
          const adEnd = new Date(ad.availability_end);
          return adStart <= dateRange.to! && adEnd >= dateRange.from!;
        });
      }

      if (mapBounds) {
        adsToFilter = adsToFilter.filter((ad) => {
          const adLat = ad.latitude;
          const adLng = ad.longitude;
          const withinLat = adLat >= mapBounds.getSouthWest().lat && adLat <= mapBounds.getNorthEast().lat;
          const withinLng = adLng >= mapBounds.getSouthWest().lng && adLng <= mapBounds.getNorthEast().lng;
          return withinLat && withinLng;
        });
      }

      setFilteredAds(adsToFilter);
    };

    filterAds();
  }, [mapBounds, dateRange, ads]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const applyFilter = () => {
    if (dateRange?.from && dateRange?.to) {
      const filtered = ads.filter((ad) => {
        const adStart = new Date(ad.availability_start);
        const adEnd = new Date(ad.availability_end);
        return adStart <= dateRange.to! && adEnd >= dateRange.from!;
      });
      setFilteredAds(filtered);
    } else {
      setFilteredAds(ads);
    }
  };

  const handleCleanFilters = () => {
    setDateRange(undefined);
    setFilteredAds(ads);
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-7/12 flex flex-col">
          <div className="p-4">
            <FilterBar
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
              onFilterApply={applyFilter}
              onCleanFilters={handleCleanFilters}
              className="max-w-xs mx-auto"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <ListingList ads={filteredAds} />
          </div>
        </div>

        <div className="w-5/12 relative">
          <div className="absolute inset-0">
            {isMapLoading ? (
              <div className="w-full h-full bg-gray-100 animate-pulse">
                <Skeleton className="w-full h-full" />
              </div>
            ) : (
              <AdMapNoSSR
                ads={filteredAds}
                latitude={userLocation?.lat || 59.3293}
                longitude={userLocation?.lng || 18.0686}
                onMapBoundsChange={handleMapBoundsChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}