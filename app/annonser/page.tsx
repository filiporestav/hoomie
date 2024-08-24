// app/annonser/page.tsx
import React from "react";
import ListingList from "./ListingList";
import { fetchListings } from "./fetchListings";

const HomeExchangePage = async () => {
  const listings = await fetchListings(); // Fetch the listings on the server

  return (
    <div className="p-6 max-w-screen-lg mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Annonser
      </h1>
      <ListingList listings={listings} />{" "}
      {/* Pass listings to the client component */}
    </div>
  );
};

export default HomeExchangePage;
