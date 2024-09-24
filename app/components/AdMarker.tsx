// AdMarker.tsx
"use client";

import React from "react";
import { Marker } from "@react-google-maps/api";
import { useRouter } from "next/navigation"; // Use next/navigation for Next.js 13+

interface AdMarkerProps {
  id: string;
  position: { lat: number; lng: number };
  propertyDescription: string;
  imageUrl: string; // URL for the mini image
}

const AdMarker: React.FC<AdMarkerProps> = ({
  id,
  position,
  propertyDescription,
  imageUrl,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/annonser/${id}`);
  };

  return (
    <Marker
      position={position}
      title={propertyDescription} // Tooltip with description
      onClick={handleClick} // Redirect on marker click
      icon={{
        url: imageUrl,
        scaledSize: new window.google.maps.Size(40, 40), // Customize size as needed
      }}
    />
  );
};

export default AdMarker;
