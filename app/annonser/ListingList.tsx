// app/annonser/ListingList.tsx
"use client";

import React, { useState } from "react";
import FilterBar from "./FilterBar";

type Listing = {
  id: number;
  title: string;
  location: string;
  availabilityWeeks: string[];
  image: string;
};

type ListingListProps = {
  listings: Listing[];
};

const ListingList: React.FC<ListingListProps> = ({ listings }) => {
  const [locationFilter, setLocationFilter] = useState("");
  const [weekFilter, setWeekFilter] = useState<string[]>([]);

  const clearFilters = () => {
    setLocationFilter("");
    setWeekFilter([]);
  };

  const filteredListings = listings.filter((listing) => {
    const matchesLocation = locationFilter
      ? listing.location.toLowerCase().includes(locationFilter.toLowerCase()) // Case-insensitive match
      : true;

    const matchesWeek = weekFilter.length
      ? weekFilter.some((week) => listing.availabilityWeeks.includes(week))
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-200"
            >
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  {listing.title}
                </h2>
                <p className="text-gray-600 mb-2">{listing.location}</p>
                <p className="text-sm text-gray-500">
                  Tillgängliga veckor:{" "}
                  <span className="font-medium">
                    {listing.availabilityWeeks.join(", ")}
                  </span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No listings found.</p>
        )}
      </div>
    </>
  );
};

export default ListingList;
