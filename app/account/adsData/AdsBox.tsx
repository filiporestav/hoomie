import React from "react";

interface AdsBoxProps {
  id: string;
  propertyDescription: string;
  areaDescription: string;
  location: string;
  country: string;
  imageUrls: string[];
  onEdit: (ad: any) => void;
}

const AdsBox: React.FC<AdsBoxProps> = ({
  id,
  propertyDescription,
  areaDescription,
  location,
  country,
  imageUrls,
  onEdit
}) => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-sm">
      {/* {imageUrls.length > 0 && (
        <img
          src={imageUrls[0]} // Display the first image; adjust as needed
          alt="Ad Image"
          className="w-full h-40 object-cover rounded-t-lg"
        />
      )} */}
      <div className="mt-2">
        <h3 className="text-lg font-semibold">{location}, {country}</h3>
        <p className="text-gray-600">{propertyDescription}</p>
        <p className="text-gray-500">{areaDescription}</p>
        <button
          onClick={() => onEdit({ id, property_description: propertyDescription, area_description: areaDescription, location, country, image_urls: imageUrls })}
          className="mt-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default AdsBox;
