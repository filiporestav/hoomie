"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Clock, User, Star, CheckCircle } from "lucide-react";
import AdMap from "../../components/AdMap";
import Ad from "../../components/AdInterface";
import HoverMessageButton from './hover-message-button'
import { CheckboxIcon } from "@radix-ui/react-icons";

interface Profile {
  id: string;
  full_name: string;
  username: string;
  verified: boolean;
}

interface Rating {
  average_communication: number;
  average_cleanliness: number;
  average_facilities: number;
  average_overall: number;
}

interface Review {
  reviewed_by: string;
  rating_text: string;
  rating_overall: number;
  username?: string;
  avatar_url?: string;
  avatar_image_url?: string | null;  // New property to store the downloaded image URL
}

export default function ListingPage() {
  const { listingId } = useParams();
  const [listing, setListing] = useState<Ad | null>(null);
  const [listingOwner, setListingOwner] = useState<Profile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ratings, setRatings] = useState<Rating | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const router = useRouter();
  const supabase = createClient();
  const [currentUserAd, setCurrentUserAd] = useState<boolean>(false);
  // Function to download avatar image
  const downloadAvatarImage = async (path: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        console.error("Error downloading avatar image:", error);
        return null;
      }
      return URL.createObjectURL(data);
    } catch (error) {
      console.error("Error downloading image:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchListingAndOwner = async () => {
      try {
        setIsLoading(true);

        const { data: adData, error: adError } = await supabase
          .from("ads")
          .select("*")
          .eq("id", listingId)
          .single();

        if (adError) {
          console.error("Error fetching listing:", adError);
          return;
        }

        if (adData) {
          setListing(adData);

          const { data: ownerProfile, error: profileError } = await supabase
            .from("profiles")
            .select("id, full_name, verified, username")
            .eq("id", adData.user_id)
            .single();

          if (profileError) {
            console.error("Error fetching listing owner:", profileError);
          } else {
            setListingOwner(ownerProfile);
          }

          // Fetch ratings
          const { data: ratingsData, error: ratingsError } = await supabase
            .from("profileReviews")
            .select(
              "average_communication, average_cleanliness, average_facilities, average_overall"
            )
            .eq("user_id", adData.user_id)
            .single();

          if (ratingsError) {
            console.error("Error fetching ratings:", ratingsError);
          } else {
            setRatings(ratingsData);
          }

          // Fetch reviews
          const { data: reviewsData, error: reviewsError } = await supabase
            .from("reviews")
            .select("reviewed_by, rating_text, rating_overall")
            .eq("reviewed_user", adData.user_id);

          if (reviewsError) {
            console.error("Error fetching reviews:", reviewsError);
          } else {
            // Fetch usernames and avatars for each review
            const reviewsWithUserInfo = await Promise.all(
              reviewsData.map(async (review) => {
                const { data: userData, error: userError } = await supabase
                  .from("profiles")
                  .select("username, avatar_url")
                  .eq("id", review.reviewed_by)
                  .single();

                if (userError) {
                  console.error("Error fetching user info:", userError);
                  return review;
                }

                // Download the avatar image using the avatar_url
                const avatarImageUrl = await downloadAvatarImage(userData.avatar_url);

                return { ...review, ...userData, avatar_image_url: avatarImageUrl };
              })
            );
            setReviews(reviewsWithUserInfo);
          }
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();
        setCurrentUser(user);

        if (user) {
          const { data: userAd, error: userAdError } = await supabase
            .from("ads")
            .select("id")
            .eq("user_id", user.id)
            .single();

          if (userAdError) {
            console.error("Error checking user ad:", userAdError);
          } else {
            setCurrentUserAd(!!userAd);
          }
        }
      } catch (error) {
        console.error("Error in fetchListingAndOwner:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (listingId) {
      fetchListingAndOwner();
    }
  }, [listingId, supabase]);
  

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const handleSendMessage = async () => {
    if (currentUser && listing && currentUserAd ) {
      const { data: existingConversation, error: fetchError } = await supabase
        .from("conversations")
        .select("id")
        .or(`user1.eq.${currentUser.id},user2.eq.${currentUser.id}`)
        .or(`user1.eq.${listing.user_id},user2.eq.${listing.user_id}`)
        .single();
  
      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error checking existing conversation:", fetchError);
        return;
      }
  
      let conversationId;
  
      if (existingConversation) {
        conversationId = existingConversation.id;
      } else {
        const { data: newConversation, error: insertError } = await supabase
          .from("conversations")
          .insert({
            user1: currentUser.id,
            user2: listing.user_id,
            last_message: new Date().toISOString(),
          })
          .select("id")
          .single();
  
        if (insertError) {
          console.error("Error creating new conversation:", insertError);
          return;
        }
  
        conversationId = newConversation.id;
      }
  
      router.push(`/meddelanden?conversationId=${conversationId}`);
    } else {
      alert("Vänligen logga in och skapa en annons för att kunna skicka meddelanden.");
    }
  };

  if (isLoading) {
    return (
      <Card className="max-w-lg mx-auto mt-10">
        <CardContent className="text-center py-10">
          <p className="text-xl text-muted-foreground">Laddar annons...</p>
        </CardContent>
      </Card>
    );
  }

  if (!listing) {
    return (
      <Card className="max-w-lg mx-auto mt-10">
        <CardContent className="text-center py-10">
          <p className="text-xl text-muted-foreground">
            Annonsen kunde inte hittas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-3xl font-bold">{listing.title}</CardTitle>
          <div className="flex items-center text-sm mt-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>
              {listing.address}, {listing.city}, {listing.country}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Fastigheten</h3>
                <p className="text-lg">{listing.property_description}</p>
              </div>
              <Separator />
              <div>
                <h3 className="text-xl font-semibold mb-2">Området</h3>
                <p className="text-muted-foreground">
                  {listing.area_description}
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  <span>
                    Tillgänglig för byte:{" "}
                    {formatDate(listing.availability_start)} -{" "}
                    {formatDate(listing.availability_end)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary" />
                  <span>Publicerad: {formatDate(listing.created_at)}</span>
                </div>
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary" />
                  <span className="flex items-center space-x-1">
                    <span>Annonsör: {listingOwner?.full_name || "Laddar..."}</span>
                    {listingOwner?.verified && (
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    )}
                  </span>
                </div>
              </div>
              <Separator />
              {ratings && (
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold mb-2">Betyg</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                      <span>Kommunikation: {ratings.average_communication.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                      <span>Renlighet: {ratings.average_cleanliness.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                      <span>Faciliteter: {ratings.average_facilities.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                      <span>Totalt: {ratings.average_overall.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="lg:w-1/2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <div className="grid grid-cols-2 gap-2 cursor-pointer">
                    {listing.image_urls.slice(0, 4).map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                      >
                        <Image
                          src={url}
                          alt={`Image of ${listing.property_description}`}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    ))}
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl z-[999]">
                  <Carousel>
                    <CarouselContent>
                      {listing.image_urls.map((url, index) => (
                        <CarouselItem key={index}>
                          <div className="relative aspect-video">
                            <Image
                              src={url}
                              alt={`Image of ${listing.property_description}`}
                              layout="fill"
                              objectFit="contain"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
        </CardContent>
        <CardFooter className="flex justify-between bg-secondary p-6">
          <Button variant="outline" onClick={() => window.history.back()}>
            Tillbaka till alla annonser
          </Button>
          <HoverMessageButton
            currentUser={currentUser}
            listing={listingOwner?.id}
            currentUserAd={currentUserAd}
            completeProfile={!!currentUser?.full_name && !!currentUser?.username}
            handleSendMessage={handleSendMessage}
          />
        </CardFooter>
      </Card>
      {reviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recensioner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <Image
                    src={review.avatar_image_url|| "/default-avatar.png"}
                    alt={review.username || "Användarens avatar"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <div className="flex items-center">
                      <span className="font-semibold mr-2">{review.username}</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="ml-1">{review.rating_overall}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{review.rating_text}</p>
                  </div>
                </div>
              ))}
            </div>
          
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Karta</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-96 w-full">
            <AdMap
              ads={[listing]}
              latitude={listing.latitude}
              longitude={listing.longitude}
            />
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}