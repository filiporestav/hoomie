"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, MapPinIcon, Star } from "lucide-react";
import Image from "next/image";
import UserReview from "../components/UserReview";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface MyTripsProps {
  userId: string;
}

interface Ad {
  id: string;
  title: string;
  address: string;
  city: string;
  country: string;
  image_urls: string[];
  user_id: string;
}

interface TripWithAd {
  ad: Ad;
  user_1: string;
  user_2: string;
  exchange_start: string;
  exchange_end: string;
}

interface Review {
  rating_communication: number;
  rating_cleanliness: number;
  rating_facilities: number;
  rating_area: number;
  rating_overall: number;
}

export default function MyTrips({ userId }: MyTripsProps) {
  const [myTrips, setMyTrips] = useState<TripWithAd[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();
  const [reviewTrip, setReviewTrip] = useState<TripWithAd | null>(null);
  const [reviews, setReviews] = useState<{ [key: string]: Review }>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchMyTrips = async () => {
      setLoading(true);
      try {
        const { data: tripsData, error: tripsError } = await supabase
          .from("exchanges")
          .select("user_1, user_2, exchange_start, exchange_end")
          .or(`user_1.eq.${userId},user_2.eq.${userId}`);

        if (tripsError) throw tripsError;

        if (!tripsData || tripsData.length === 0) {
          setMyTrips([]);
          setLoading(false);
          return;
        }

        const otherUserIds = tripsData.map((trip) =>
          trip.user_1 === userId ? trip.user_2 : trip.user_1
        );

        const { data: adsData, error: adsError } = await supabase
          .from("ads")
          .select("id, title, city, country, image_urls, user_id, address")
          .in("user_id", otherUserIds);

        if (adsError) throw adsError;

        const combinedTrips = tripsData
          .map((trip) => {
            const ad = adsData.find(
              (ad) =>
                ad.user_id === (trip.user_1 === userId ? trip.user_2 : trip.user_1)
            );
            if (!ad) return null;

            return {
              ad,
              user_1: trip.user_1,
              user_2: trip.user_2,
              exchange_start: trip.exchange_start,
              exchange_end: trip.exchange_end,
            };
          })
          .filter(Boolean) as TripWithAd[];

        setMyTrips(combinedTrips);

        // Fetch existing reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select("reviewed_user, rating_overall, rating_communication, rating_cleanliness, rating_facilities, rating_area")
          .eq("reviewed_by", userId);

        if (reviewsError) throw reviewsError;

        const reviewsMap = reviewsData.reduce((acc, review) => {
          acc[review.reviewed_user] = review;
          return acc;
        }, {} as { [key: string]: Review });

        setReviews(reviewsMap);
      } catch (error) {
        console.error("Error fetching trips, ads, or reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMyTrips();
    }
  }, [userId, supabase]);

  const handleReviewSubmit = async (reviewedUser: string) => {
    const { data, error } = await supabase
      .from("reviews")
      .select("rating_overall, rating_communication, rating_cleanliness, rating_facilities, rating_area")
      .eq("reviewed_by", userId)
      .eq("reviewed_user", reviewedUser)
      .single();

    if (error) {
      console.error("Error fetching updated review:", error);
      return;
    }

    setReviews((prev) => ({
      ...prev,
      [reviewedUser]: data,
    }));

    setReviewTrip(null);
    toast({
      title: "Recension skickad!",
      description: "Tack för att du gör sajten bättre!",
      duration: 4000,
    });
  };

  if (loading) return <div className="text-center p-8">Laddar...</div>;

  if (myTrips.length === 0) {
    return <div className="text-center p-8">Du har inga kommande resor.</div>;
  }

  const currentDate = new Date();
  const upcomingTrips = myTrips.filter(
    (trip) => new Date(trip.exchange_start) >= currentDate
  );
  const pastTrips = myTrips.filter(
    (trip) => new Date(trip.exchange_start) < currentDate
  );

  const TripList = ({ trips }: { trips: TripWithAd[] }) => (
    <ScrollArea className="h-[600px] w-full">
      <div className="space-y-4">
        {trips.map((trip) => (
          <Card key={trip.ad.id} className="overflow-hidden">
            <div className="flex">
              <div className="relative w-1/3 h-40">
                <Image
                  src={trip.ad.image_urls[0] || "/placeholder.png"}
                  alt={trip.ad.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <CardContent className="w-2/3 p-4">
                <h3 className="text-lg font-semibold mb-2">{trip.ad.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>
                    {trip.ad.city}, {trip.ad.country}, {trip.ad.address}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>
                    {new Date(trip.exchange_start).toLocaleDateString()} -{" "}
                    {new Date(trip.exchange_end).toLocaleDateString()}
                  </span>
                </div>
                {new Date(trip.exchange_end) < currentDate && (
                  <div className="flex items-center justify-between mt-2">
                    {reviews[trip.ad.user_id] ? (
                      <div className="flex items-center">
                        <p className="text-sm text-muted-foreground mr-2">
                          Din recension:
                        </p>
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>
                          {(
                            (reviews[trip.ad.user_id].rating_communication +
                              reviews[trip.ad.user_id].rating_cleanliness +
                              reviews[trip.ad.user_id].rating_facilities +
                              reviews[trip.ad.user_id].rating_area +
                              reviews[trip.ad.user_id].rating_overall) / 5
                          ).toFixed(1)}
                        </span>
                      </div>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        className="ml-auto"
                        onClick={() => setReviewTrip(trip)}
                      >
                        Lämna en recension
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Mina resor</h2>
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Kommande resor</TabsTrigger>
          <TabsTrigger value="past">Tidigare resor</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {upcomingTrips.length > 0 ? (
            <TripList trips={upcomingTrips} />
          ) : (
            <div className="text-center p-8">Du har inga kommande resor.</div>
          )}
        </TabsContent>
        <TabsContent value="past">
          {pastTrips.length > 0 ? (
            <TripList trips={pastTrips} />
          ) : (
            <div className="text-center p-8">Du har inga tidigare resor.</div>
          )}
        </TabsContent>
      </Tabs>
      {reviewTrip && (
        <UserReview
          reviewedBy={userId}
          reviewedUser={reviewTrip.ad.user_id}
          isOpen={!!reviewTrip}
          onClose={() => setReviewTrip(null)}
          onSubmit={() => handleReviewSubmit(reviewTrip.ad.user_id)}
        />
      )}
    </div>
  );
}