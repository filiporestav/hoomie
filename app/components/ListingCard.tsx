import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Calendar, User } from "lucide-react"; // Add User icon for "My ad"
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
import { createClient } from "@/app/utils/supabase/client";

interface ListingCardProps {
  ad: Ad;
  userId: string; // You need to pass the logged-in user's ID
}

export default function ListingCard({ ad, userId }: ListingCardProps) {
  const supabase = createClient();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [isOwnAd, setIsOwnAd] = useState<boolean>(false);

  // Check if the ad is already favorited by the user
  useEffect(() => {
    const checkFavorite = async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("ad_id", ad.id)
        .single();

      if (error) {
        console.error("Error checking favorite:", error.message);
        return;
      }
      setIsFavorited(!!data); // If data exists, the ad is favorited
    };

    const checkIfOwnAd = () => {
      if (ad.user_id === userId) {
        setIsOwnAd(true); // Mark this as the user's own ad
      }
    };

    checkFavorite();
    checkIfOwnAd();
  }, [ad.id, ad.user_id, userId]);

  const toggleFavorite = async () => {
    if (isFavorited) {
      // Remove favorite
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("ad_id", ad.id);

      if (error) {
        console.error("Error unfavoriting:", error.message);
      } else {
        setIsFavorited(false);
      }
    } else {
      // Add to favorites
      const { error } = await supabase
        .from("favorites")
        .insert([{ user_id: userId, ad_id: ad.id }]);

      if (error) {
        console.error("Error favoriting:", error.message);
      } else {
        setIsFavorited(true);
      }
    }
  };

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

  const handleClick = () => {
    sessionStorage.setItem("selectedAd", JSON.stringify(ad));
    router.push(`annonser/${ad.id}`);
  };

  return (
    <Card     className="overflow-hidden transition-transform transform hover:scale-105 hover:z-10 cursor-pointer"
    onClick={handleClick}>
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

          {/* Display "My ad" badge if it's the user's own ad */}
          {isOwnAd && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-lg text-xs">
              <User className="inline-block h-4 w-4 mr-1" />
              Min annons
            </div>
          )}

          {/* Disable favorite button if it's the user's own ad */}
          {!isOwnAd && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white bg-opacity-50 hover:bg-opacity-75 transition-opacity"
              onClick={toggleFavorite}
            >
              <Heart
                className={`h-4 w-4 ${isFavorited ? "fill-red-500" : ""}`}
              />
            </Button>
          )}
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
              {formatDate(ad.availability_start.toString())} -{" "}
              {formatDate(ad.availability_end.toString())}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
