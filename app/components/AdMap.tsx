// AdMap.tsx
"use client";
import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import AdMarker from "./AdMarker"; // Import your custom marker

interface Ad {
  id: string;
  latitude: number;
  longitude: number;
  property_description: string;
  image_urls: string[]; // Assuming you have an array of images
}

interface AdMapProps {
  ads: Ad[]; // Array of ads with latitude and longitude
}

const containerStyle = {
  width: "100%",
  height: "400px", // Adjust height as needed
};

const AdMap: React.FC<AdMapProps> = ({ ads }) => {
  const [center, setCenter] = useState({ lat: 59.3293, lng: 18.0686 }); // Default center

  // Update the center to the first ad's location if ads are available
  useEffect(() => {
    if (ads.length > 0) {
      setCenter({ lat: ads[0].latitude, lng: ads[0].longitude });
    }
  }, [ads]);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10} // Adjust zoom level as needed
      >
        {ads.map((ad) => (
          <AdMarker
            key={ad.id}
            id={ad.id}
            position={{ lat: ad.latitude, lng: ad.longitude }}
            propertyDescription={ad.property_description}
            imageUrl={ad.image_urls[0]} // Use the first image for the marker
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default AdMap;
