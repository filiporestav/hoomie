import React from "react";

interface AdsBoxProps {
  id: string;
  propertyDescription: string;
  areaDescription: string;
  address: string;
  city: string;
  country: string;
  imageUrls: string[] | null; // Allow imageUrls to be null
  onEdit: (ad: any) => void;
}

const AdsBox: React.FC<AdsBoxProps> = ({
  id,
  propertyDescription,
  areaDescription,
  address,
  city,
  country,
  imageUrls,
  onEdit
}) => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-sm">
      {/* Check if imageUrls is defined and is an array before rendering the image */}
      {Array.isArray(imageUrls) && imageUrls.length > 0 && (
        <img
          src={imageUrls[0]} // Display the first image; adjust as needed
          alt="Ad Image"
          className="w-full h-40 object-cover rounded-t-lg"
        />
      )}
      <div className="mt-2">
        <h3 className="text-lg font-semibold">{address}, {city}, {country}</h3>
        <p className="text-gray-600">{propertyDescription}</p>
        <p className="text-gray-500">{areaDescription}</p>
        <button
          onClick={() => onEdit({ id, property_description: propertyDescription, area_description: areaDescription, address, city, country, image_urls: imageUrls })}
          className="mt-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default AdsBox;