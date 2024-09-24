"use client";
import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import AdMarker from "./AdMarker";
import Ad from "./AdInterface";

interface AdMapProps {
  ads: Ad[];
}

const containerStyle = {
  width: "100%",
  height: "100vh", // Full height of the viewport
};

export default function AdMap({ ads }: AdMapProps) {
  const [center, setCenter] = useState({ lat: 59.3293, lng: 18.0686 }); // Default center (Stockholm)

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
        zoom={10}
      >
        {ads.map((ad) => (
          <AdMarker
            key={ad.id}
            id={ad.id}
            position={{ lat: ad.latitude, lng: ad.longitude }}
            propertyDescription={ad.property_description}
            imageUrl={ad.image_urls[0]}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}