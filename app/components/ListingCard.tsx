import React from "react";
import Image from "next/image";
import Link from "next/link";

type ListingCardProps = {
  id: number;
  imageSrc: string;
  title: string;
  location: string;
  availabilityWeeks: string[];
};

const ListingCard: React.FC<ListingCardProps> = ({
  id,
  imageSrc,
  title,
  location,
  availabilityWeeks,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
      <Link href={`/listing/${id}`}>
        <Image
          src={imageSrc}
          alt={title}
          width={400}
          height={250}
          className="rounded-lg object-cover hover:scale-105 transition-transform duration-200"
        />
        <div className="mt-4">
          <h4 className="text-2xl font-bold text-gray-900">{title}</h4>
          <p className="text-gray-700 mt-2">{location}</p>
          <p className="text-sm text-gray-500">
            Tillgängliga veckor:{" "}
            <span className="font-medium text-gray-800">
              {availabilityWeeks.join(", ")}
            </span>
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
