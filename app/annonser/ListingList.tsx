// ListingList.tsx
"use client";

import React, { useState, useEffect } from "react";
import FilterBar from "./FilterBar";
import ListingCard from "../components/ListingCard";
import { fetchListings } from "../annonser/fetchListings"; // Import the function

type Listing = {
  id: number;
  propertyDescription: string;
  city: string;
  imageUrls: string[];
};

const ListingList: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]); // State for storing listings
  const [loading, setLoading] = useState(true); // Loading state
  const [locationFilter, setLocationFilter] = useState("");
  const [weekFilter, setWeekFilter] = useState<string[]>([]);

  // Fetch listings when the component mounts
  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        const fetchedListings = await fetchListings(); // Call the fetchListings function
        setListings(fetchedListings); // Store the listings in state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setLoading(false);
      }
    };

    loadListings(); // Invoke the function inside useEffect
  }, []); // Empty dependency array means this runs once on mount

  const clearFilters = () => {
    setLocationFilter("");
    setWeekFilter([]);
  };

  const filteredListings = listings.filter((listing) => {
    const matchesLocation = locationFilter
      ? listing.city.toLowerCase().includes(locationFilter.toLowerCase())
      : true;

    return matchesLocation; // Adjust logic as needed
  });

  return (
    <>
      <FilterBar
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        weekFilter={weekFilter}
        setWeekFilter={setWeekFilter}
        clearFilters={clearFilters}
      />

      {loading ? (
        <p className="text-center text-gray-500 mt-16">Laddar annonser...</p> // Display loading message
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                propertyDescription={listing.propertyDescription}
                city={listing.city}
                imageUrls={listing.imageUrls}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center mt-16">Inga annonser hittades.</p>
          )}
        </div>
      )}
    </>
  );
};

export default ListingList;
