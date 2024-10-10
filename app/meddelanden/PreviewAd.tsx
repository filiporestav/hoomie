// ListingCard.tsx
import React from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ad } from "@/app/types"; // Adjust the import based on your project's structure
import { useRouter } from "next/navigation";

interface ListingCardProps {
  ad: Ad;
}

const PreviewAd: React.FC<ListingCardProps> = ({ ad }) => {
  const router = useRouter();

  const handleClick = () => {
    sessionStorage.setItem("selectedAd", JSON.stringify(ad));
    router.push(`/annonser/${ad.id}`);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          {ad.image_urls.length > 0 && (
            <Image
              src={ad.image_urls[0]} // Display the first image
              alt={ad.title}
              width={300}
              height={200}
              className="object-cover w-full h-48"
            />
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{ad.title}</h3>
          <p className="text-muted-foreground text-sm">{ad.city}</p>
          <p className="text-sm text-muted-foreground mb-2">
            {ad.property_description.substring(0, 120)}...
          </p>
        </div>
      </CardContent>
      <CardFooter className="bg-secondary p-3">
        <Button variant="secondary" onClick={handleClick}>
          Se annons
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PreviewAd;
