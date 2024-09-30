import React from "react";
import Image from "next/image";
import { Heart, Calendar } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Ad from "./AdInterface";
import { useRouter } from "next/navigation";

interface ListingCardProps {
  ad: Ad;
}

export default function ListingCard({ ad }: ListingCardProps) {
  const router = useRouter();
  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {ad.image_urls.map((url, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={url}
                      alt={`${ad.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white bg-opacity-50 hover:bg-opacity-75 transition-opacity"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{ad.title}</h3>
            <Badge variant="secondary">{ad.city}</Badge>
          </div>
          <p className="text-muted-foreground text-sm mb-2">
            {truncateDescription(ad.property_description, 120)}
          </p>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {ad.availability_start.toString()} -
              {ad.availability_end.toString()}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 bg-secondary">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => router.push(`annonser/${ad.id}`)}
        >
          Se annons
        </Button>
      </CardFooter>
    </Card>
  );
}
