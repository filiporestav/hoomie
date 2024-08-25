import React from "react";
import ListingList from "./ListingList";
import { fetchListings } from "./fetchListings";

const HomeExchangePage = async () => {
  const listings = await fetchListings(); // Fetch the listings on the server

  return (
    <div className="p-8 max-w-screen-xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">
        Utforska annonser
      </h1>
      <ListingList listings={listings} />
    </div>
  );
};

export default HomeExchangePage;
