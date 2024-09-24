"use client";

import React from 'react';
import { useRouter } from 'next/router';
import { GoogleMap, Marker } from '@react-google-maps/api';

const MapComponent: React.FC<{ ads: { id: string; lat: number; lng: number }[] }> = ({ ads }) => {
  const router = useRouter();
  const defaultCenter = { lat: 59.3293, lng: 18.0686 }; // Set your default center

  const handleMarkerClick = (adId: string) => {
    router.push(`/annonser/${adId}`);
  };

  return (
    <GoogleMap
      center={defaultCenter}
      zoom={10}
      mapContainerClassName="h-96 w-full"
    >
      {ads.map(ad => (
        <Marker
          key={ad.id}
          position={{ lat: ad.lat, lng: ad.lng }}
          onClick={() => handleMarkerClick(ad.id)} // Redirect on marker click
        />
      ))}
    </GoogleMap>
  );
};

export default MapComponent;
