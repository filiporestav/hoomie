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
    </div>
  );
};

export default HomeExchangePage;