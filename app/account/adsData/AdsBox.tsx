import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AdsBoxProps {
  id: string;
  propertyDescription: string;
  areaDescription: string;
  address: string;
  city: string;
  country: string;
  imageUrls: string[] | null;
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
    <Card>
      <CardHeader>
        <CardTitle>{address}, {city}, {country}</CardTitle>
      </CardHeader>
      <CardContent>
        {Array.isArray(imageUrls) && imageUrls.length > 0 && (
          <div className="relative h-40 mb-4">
            <Image
              src={imageUrls[0]}
              alt="Ad Image"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        )}
        <p className="text-sm text-gray-600 mb-2">{propertyDescription}</p>
        <p className="text-sm text-gray-500">{areaDescription}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onEdit({ id, property_description: propertyDescription, area_description: areaDescription, address, city, country, image_urls: imageUrls })}>
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdsBox;