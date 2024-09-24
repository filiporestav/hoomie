"use client";

import React from "react";
import ListingList from "./ListingList";
import MapComponent from '../components/MapComponent';

const HomeExchangePage: React.FC = () => {
  return (
    <div className="p-8 max-w-screen-xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">
        Utforska annonser
      </h1>
      <ListingList />
      <div className="mt-8"> {/* Add margin for spacing */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Your Ads Map
        </h2>
        <MapComponent />
      </div>
    </div>
  );
};

export default HomeExchangePage;
