'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import ListingList from './ListingList';
import { fetchListings } from './fetchListings';
import Ad from '../components/AdInterface';
import { useClient } from '../ClientProvider';
import { set } from 'date-fns';

// Dynamically import the AdMap component with SSR disabled
const AdMapNoSSR = dynamic(() => import('../components/AdMap'), { ssr: false });

export default function HomeExchangePage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const isClient = useClient();

  // Fetch user location and listings on component mount
  useEffect(() => {
    const loadAds = async () => {
      try {
        const fetchedAds = await fetchListings();
        setAds(fetchedAds);
      } catch (error) {
        console.error('Error fetching ads:', error);
      }
    };

    // Fetch user's location using the Geolocation API
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error('Error fetching user location:', error);
          }
        );
      } else {
        setUserLocation({ lat: 59.3293, lng: 18.0686 }); // Default to Stockholm if geolocation is not supported
        console.error('Geolocation is not supported by this browser');
      }
    };

    getUserLocation(); // Call function to get location
    loadAds(); // Load ads
  }, []); // Empty dependency array ensures this runs once on mount

  if (!isClient) return null;

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-2xl text-primary font-bold p-4">Utforska annonser</h1>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-7/12 overflow-y-auto p-4">
          <ListingList ads={ads} />
        </div>
        <div className="w-5/12 relative">
          <div className="absolute inset-0">
            {userLocation ? (
              <AdMapNoSSR ads={ads} latitude={userLocation.lat} longitude={userLocation.lng} />
            ) : (
              <p>Loading map...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}