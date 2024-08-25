"use client";

import React, { useState } from "react";
import FilterBar from "./FilterBar";
import ListingCard from "../components/ListingCard";

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
      ? listing.location.toLowerCase().includes(locationFilter.toLowerCase())
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              id={listing.id}
              title={listing.title}
              location={listing.location}
              availabilityWeeks={listing.availabilityWeeks}
              imageSrc={listing.image}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center mt-16">
            Inga annonser hittades.
          </p>
        )}
      </div>
    </>
  );
};

export default ListingList;
