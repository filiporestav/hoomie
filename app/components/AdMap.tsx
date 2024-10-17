import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { LatLngExpression, Icon, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Ad from './AdInterface';
import ListingCard from './ListingCard';
import { useClient } from '../ClientProvider';
import { useRouter } from "next/navigation";
import type { Map as LeafletMap } from 'leaflet';

interface AdMapProps {
  ads: Ad[];
  latitude: number;
  longitude: number;
  onMapBoundsChange?: (bounds: LatLngBounds) => void; // Callback to pass bounds to parent
}

const AdMap: React.FC<AdMapProps> = ({ ads, latitude, longitude, onMapBoundsChange }) => {
  const [customIcon, setCustomIcon] = useState<Icon | null>(null);
  const router = useRouter();
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    const icon = new Icon({
      iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38],
    });
    setCustomIcon(icon);
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      console.log('Map is ready:', mapRef.current);
    }
  }, []);

  const isClient = useClient();
  if (!isClient) return null;

  const mapCenter: LatLngExpression = [latitude, longitude];

  // Detect map events and capture bounds changes
  const MapEventHandler = () => {
    useMapEvents({
      moveend: () => {
        if (mapRef.current && onMapBoundsChange) {
          const bounds = mapRef.current.getBounds();
          onMapBoundsChange(bounds); // Call the parent callback with the new bounds
        }
      },
    });
    return null;
  };

  const handleClick = (ad: Ad) => {
    sessionStorage.setItem("selectedAd", JSON.stringify(ad));
    router.push(`annonser/${ad.id}`);
  };

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      className="text-indigo-600"
      ref={mapRef} // Capture the map instance
    >
      <TileLayer
        url={`https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&scale=2`}
        attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
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

      {/* Attach event handler */}
      <MapEventHandler />
    </MapContainer>
  );
};

export default AdMap;
