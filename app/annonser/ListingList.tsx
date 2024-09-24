"use client";

import React, { useState, useEffect } from "react";
import FilterBar from "./FilterBar";
import ListingCard from "../components/ListingCard";
import { fetchListings } from "../annonser/fetchListings"; // Import the function

type Listing = {
  id: number;
  propertyDescription: string;
  areaDescription: string;
  address: string;
  city: string;
  country: string;
  imageUrls: string[];
  createdAt: string;
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

    const matchesWeek = weekFilter.length
      ? weekFilter.some((week) => listing.imageUrls.some((img) => img.includes(week))) // Example logic
      : true;

    return matchesLocation && matchesWeek;
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                propertyDescription={listing.propertyDescription}
                areaDescription={listing.areaDescription}
                address = {listing.address}
                city={listing.city}
                country={listing.country}
                imageUrls={listing.imageUrls}
                createdAt={listing.createdAt}
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
