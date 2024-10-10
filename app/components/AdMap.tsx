'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Ad from './AdInterface';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useClient } from '../ClientProvider';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import ListingCard from './ListingCard';


interface AdMapProps {
  ads: Ad[];
  latitude: number;   // Add latitude prop
  longitude: number;  // Add longitude prop
}

const AdMap: React.FC<AdMapProps> = ({ ads, latitude, longitude }) => {
  const [customIcon, setCustomIcon] = useState<Icon | null>(null);
  const router = useRouter();

  useEffect(() => {
    const icon = new Icon({
      iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38],
    });
    setCustomIcon(icon);
  }, []);

  const isClient = useClient();
  if (!isClient) return null;

  // Use the passed latitude and longitude to center the map
  const mapCenter: LatLngExpression = [latitude, longitude];

  const truncateDescription = (description: string) => {
    if (description.length <= 30) return description;
    return (
      <span className="truncated-text">
        {description.slice(0, 25)}
        <span className="fade-out">{description.slice(25, 30)}</span>
        ...
      </span>
    );
  };

  const handleClick = (ad: Ad) => {
    sessionStorage.setItem("selectedAd", JSON.stringify(ad));
    router.push(`annonser/${ad.id}`);
  };
  

  return (
    <MapContainer 
      center={mapCenter}  // Use the dynamic map center
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
      className="text-indigo-600"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={19}
      />
      {ads.map((ad) => (
        <Marker 
          key={ad.id} 
          position={[ad.latitude, ad.longitude] as LatLngExpression}
          icon={customIcon || undefined} // Only render if customIcon is defined
        >
          <Popup className="custom-popup">
            <ListingCard ad={ad}/>  
          </Popup>
          
        </Marker>
      ))}
    </MapContainer>
  );
};

export default AdMap;
