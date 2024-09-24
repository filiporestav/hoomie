"use client";

import React, { useState } from "react";
import FilterBar from "./FilterBar";
import ListingCard from "../components/ListingCard";

type Listing = {
  id: number;
  property_description: string;
  area_description: string;
  location: string;
  country: string;
  image_urls: string[]; // Changed from `image` to `image_urls` for multiple images
  created_at: string; // Assuming ISO date string
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
    console.log("Original listing before filtering:", listing);
    const matchesLocation = locationFilter
      ? listing.location.toLowerCase().includes(locationFilter.toLowerCase())
      : true;

    const matchesWeek = weekFilter.length
      ? weekFilter.some((week) => listing.image_urls.some((img) => img.includes(week)))
      : true;

    return matchesLocation && matchesWeek;
  });

  console.log("Filtered Listings:", filteredListings);

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
          filteredListings.map((listing) => {
            console.log("Passing listing to ListingCard:", listing);
            return (
              <ListingCard
                key={listing.id}
                id={listing.id}
                propertyDescription={listing.property_description}
                areaDescription={listing.area_description}
                location={listing.location}
                country={listing.country}
                imageUrls={listing.image_urls}
                createdAt={listing.created_at}
              />
            );
          })
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
