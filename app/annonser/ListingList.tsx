import React from "react";
import ListingCard from "../components/ListingCard";
import Ad from "../components/AdInterface";

interface ListingListProps {
  ads: Ad[];
}

export default function ListingList({ ads }: ListingListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {ads.map((ad) => (
        <ListingCard key={ad.id} ad={ad} />
      ))}
    </div>
  );
}
