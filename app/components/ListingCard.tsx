import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Calendar, User, Star } from "lucide-react"; // Added Star icon
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
  userId?: string | undefined;
}

export default function ListingCard({ ad, userId }: ListingCardProps) {
  const supabase = createClient();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [isOwnAd, setIsOwnAd] = useState<boolean>(false);
  const [rating, setRating] = useState<number | null>(null);

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
      setIsFavorited(!!data);
    };

    const checkIfOwnAd = () => {
      if (ad.user_id === userId) {
        setIsOwnAd(true);
      }
    };

    const fetchRating = async () => {
      const { data, error } = await supabase
        .from("profileReviews")
        .select("average_total_score")
        .eq("user_id", ad.user_id)
        .single();

      if (error) {
        console.error("Error fetching rating:", error.message);
        return;
      }
      setRating(data?.average_total_score || null);
    };

    checkFavorite();
    checkIfOwnAd();
    fetchRating();
  }, [ad.id, ad.user_id, userId, supabase]);

  const toggleFavorite = async () => {
    if (isFavorited) {
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
    <Card className="overflow-hidden transition-transform transform hover:scale-105 hover:z-10 cursor-pointer">
      <CardContent className="p-0" onClick={handleClick}>
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
            <div onClick={(e) => e.stopPropagation()}>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </div>
          </Carousel>

          {isOwnAd && userId !== undefined && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-lg text-xs">
              <User className="inline-block h-4 w-4 mr-1" />
              Din annons
            </div>
          )}

          {!isOwnAd && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white bg-opacity-50 hover:bg-opacity-75 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite();
              }}
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
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {formatDate(ad.availability_start.toString())} -{" "}
                {formatDate(ad.availability_end.toString())}
              </span>
            </div>
            {rating !== null && (
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-400" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}