"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import Ad from "./AdInterface";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useClient } from "../ClientProvider";
import Image from "next/image";

interface AdMapProps {
  ads: Ad[];
  latitude: number; // New prop
  longitude: number; // New prop
}

const AdMap: React.FC<AdMapProps> = ({ ads }) => {
  const [customIcon, setCustomIcon] = useState<Icon | null>(null);

  useEffect(() => {
    const icon = new Icon({
      iconUrl:
        "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png",
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38],
    });
    setCustomIcon(icon);
  }, []);

  const isClient = useClient();
  if (!isClient) return null;

  const stockholmCenter: LatLngExpression = [59.3293, 18.0686];

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

  return (
    <MapContainer
      center={stockholmCenter}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
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
            <div className="text-amber-500 w-48 sm:w-56 md:w-64">
              <h3 className="font-bold text-base mb-2">
                {truncateDescription(ad.property_description)}
              </h3>
              <Carousel className="w-full mb-3">
                <CarouselContent>
                  {ad.image_urls.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={url}
                          alt={`${ad.property_description} - Image ${
                            index + 1
                          }`}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-1 w-6 h-6" />
                <CarouselNext className="right-1 w-6 h-6" />
              </Carousel>
              <p className="text-xs mb-1">
                {truncateDescription(ad.area_description)}
              </p>
              <p className="text-xs font-semibold">
                {ad.address}, {ad.city}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default AdMap;
