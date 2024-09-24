import React from "react";
import Image from "next/image";
import Link from "next/link";

type ListingCardProps = {
  id: number;
  propertyDescription: string;
  city: string;
  imageUrls?: string[]; // Make this optional
};

const ListingCard: React.FC<ListingCardProps> = ({
  id,
  propertyDescription,
  city,
  imageUrls = [], // Default to an empty array
}) => {
  const displayImage =
    imageUrls.length > 0 ? imageUrls[0] : "/images/placeholder.jpg";

  // Truncate the property description
  const truncatedDescription =
    propertyDescription.length > 20
      ? `${propertyDescription.slice(0, 20)}...`
      : propertyDescription;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
      <Link href={`/annonser/${id}`}>
        <Image
          src={displayImage}
          alt={propertyDescription}
          width={400}
          height={250}
          className="rounded-lg object-cover hover:scale-105 transition-transform duration-200"
        />
        <div className="mt-2 text-center">
          <h4 className="text-lg font-bold text-gray-900">{city}</h4>
          <p
            className={`text-sm ${
              truncatedDescription.length > 20 ? "opacity-75" : ""
            }`}
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              display: "block",
              maxWidth: "100%",
              position: "relative",
            }}
          >
            {truncatedDescription}
            {truncatedDescription.length > 20 && (
              <span
                style={{
                  position: "absolute",
                  right: 0,
                  width: "20%",
                  height: "100%",
                  background: "linear-gradient(to left, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)",
                }}
              />
            )}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
