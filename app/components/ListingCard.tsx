import React from "react";
import Image from "next/image";
import Link from "next/link";

type ListingCardProps = {
  id: number;
  propertyDescription: string;
  areaDescription: string;
  location: string;
  country: string;
  imageUrls?: string[]; // Make this optional
  createdAt: string; // Assuming ISO date string
};

const ListingCard: React.FC<ListingCardProps> = ({
  id,
  propertyDescription,
  areaDescription,
  location,
  country,
  imageUrls = [], // Default to an empty array
  createdAt
}) => {
  const displayImage = imageUrls.length > 0 ? imageUrls[0] : "/images/placeholder.jpg";

  // Logs for debugging
  console.log("Received property description:", propertyDescription);
  console.log("Received area description:", areaDescription);
  console.log("Received location:", location);
  console.log("Received country:", country);
  console.log("Received image URLs:", imageUrls);
  console.log("Display image:", displayImage);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
      <Link href={`/listing/${id}`}>
        <Image
          src={displayImage}
          alt={propertyDescription}
          width={400}
          height={250}
          className="rounded-lg object-cover hover:scale-105 transition-transform duration-200"
        />
        <div className="mt-4">
          <h4 className="text-2xl font-bold text-gray-900">{propertyDescription}</h4>
          <p className="text-gray-700 mt-2">{location}, {country}</p>
          <p className="text-sm text-gray-500">
            Area: <span className="font-medium text-gray-800">{areaDescription}</span>
          </p>
          <p className="text-sm text-gray-500">
            Created At: <span className="font-medium text-gray-800">{new Date(createdAt).toLocaleDateString()}</span>
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
