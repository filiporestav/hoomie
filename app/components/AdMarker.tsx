import React from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";

interface AdMarkerProps {
  id: string;
  position: google.maps.LatLngLiteral;
  propertyDescription: string;
  imageUrl: string;
}

export default function AdMarker({ id, position, propertyDescription, imageUrl }: AdMarkerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const PriceBubble = () => (
    <div className="bg-white rounded-full px-2 py-1 shadow-md">
      <span className="font-semibold">100 kr SEK</span>
    </div>
  );

  return (
    <Marker
      position={position}
      onClick={toggleOpen}
      icon={{
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
          `<svg width="80" height="40" xmlns="http://www.w3.org/2000/svg">
            <rect width="80" height="40" rx="20" fill="white"/>
            <text x="40" y="25" font-family="Arial" font-size="14" fill="black" text-anchor="middle">
              100 kr
            </text>
          </svg>`
        ),
        scaledSize: new google.maps.Size(80, 40),
      }}
    >
      {isOpen && (
        <InfoWindow onCloseClick={toggleOpen}>
          <div className="max-w-xs">
            <img src={imageUrl} alt={propertyDescription} className="w-full h-32 object-cover mb-2" />
            <p className="text-sm">{propertyDescription}</p>
            <p className="text-sm font-bold mt-1">100 kr SEK per night</p>
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
}