import React, { useState } from "react";

interface AdsBoxProps {
  id: string;
  propertyDescription: string;
  areaDescription: string;
  location: string;
  country: string;
  imageUrls: string[] | null;
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
  const [currentImage, setCurrentImage] = useState(0);

  const handleNextImage = () => {
    if (imageUrls && currentImage < imageUrls.length - 1) {
      setCurrentImage((prev) => prev + 1);
    }
  };

  const handlePrevImage = () => {
    if (imageUrls && currentImage > 0) {
      setCurrentImage((prev) => prev - 1);
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-sm flex">
      {/* Image gallery */}
      {Array.isArray(imageUrls) && imageUrls.length > 0 && (
        <div className="w-1/2 relative">
          <img
            src={imageUrls[currentImage]} 
            alt={`Ad Image ${currentImage + 1}`}
            className="w-full h-40 object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex justify-between items-center">
            <button
              className="bg-black bg-opacity-50 text-white p-2 rounded-l-lg"
              onClick={handlePrevImage}
              disabled={currentImage === 0}
            >
              ‹
            </button>
            <button
              className="bg-black bg-opacity-50 text-white p-2 rounded-r-lg"
              onClick={handleNextImage}
              disabled={currentImage === imageUrls.length - 1}
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* Ad text */}
      <div className="w-1/2 pl-4">
        <h3 className="text-lg font-semibold">
          {location}, {country}
        </h3>
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
