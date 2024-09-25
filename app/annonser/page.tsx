'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import ListingList from './ListingList';
import { fetchListings } from './fetchListings';
import Ad from '../components/AdInterface';
import { useClient } from '../ClientProvider';

// Dynamically import the AdMap component with SSR disabled
const AdMapNoSSR = dynamic(() => import('../components/AdMap'), { ssr: false });

export default function HomeExchangePage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const isClient = useClient();

  // Fetch listings on component mount
  useEffect(() => {
    const loadAds = async () => {
      try {
        const fetchedAds = await fetchListings();
        setAds(fetchedAds);
      } catch (error) {
        console.error('Error fetching ads:', error);
      }
    };

    loadAds();
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
            <AdMapNoSSR ads={ads} />
          </div>
        </div>
      </div>
    </div>
  );
}
