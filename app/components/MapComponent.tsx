import React from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "400px", // Adjust height as needed
};

const center = {
  lat: 59.3293, // Default latitude (for example, Stockholm)
  lng: 18.0686, // Default longitude
};

const MapComponent: React.FC = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <p>Google Maps API key is missing!</p>;
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10} // Adjust zoom level as needed
      >
        {/* Add markers here later */}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
