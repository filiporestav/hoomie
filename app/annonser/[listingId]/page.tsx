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
import { Calendar, MapPin, Clock, User } from "lucide-react";
import AdMap from "../../components/AdMap";
import Ad from "../../components/AdInterface";
import { Suspense } from "react";
import UserAd from "@/app/meddelanden/UserAd";
import HoverMessageButton from './hover-message-button'

interface Profile {
  id: string;
  full_name: string;
}

export default function ListingPage() {
  const { listingId } = useParams();
  const [listing, setListing] = useState<Ad | null>(null);
  const [listingOwner, setListingOwner] = useState<Profile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const [currentUserAd, setCurrentUserAd] = useState<boolean>(false); // New state for currentUserAd


  useEffect(() => {
    const fetchListingAndOwner = async () => {
      try {
        setIsLoading(true);

        // Fetch the listing from Supabase
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

          // Fetch the listing owner's profile
          const { data: ownerProfile, error: profileError } = await supabase
            .from("profiles")
            .select("id, full_name")
            .eq("id", adData.user_id)
            .single();

          if (profileError) {
            console.error("Error fetching listing owner:", profileError);
          } else {
            setListingOwner(ownerProfile);
          }
        }

        // Fetch current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setCurrentUser(user);

         // Check if currentUser.id matches any user_id in the ads table
         if (user) {
          const { data: userAd, error: userAdError } = await supabase
            .from("ads")
            .select("id")
            .eq("user_id", user.id)
            .single();

          if (userAdError) {
            console.error("Error checking user ad:", userAdError);
          } else {
            setCurrentUserAd(!!userAd); // Set currentUserAd to true if the ad exists
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
    if (currentUser && listing && currentUserAd) {
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
  
      // Pass conversationId as a query parameter
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
                  <span>
                    Annonsör: {listingOwner?.full_name || "Laddar..."}
                  </span>
                </div>
              </div>
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
            <CardFooter className="flex justify-between bg-secondary p-6">

            <HoverMessageButton
            currentUser={currentUser}
            listing={listingOwner?.id}
            currentUserAd={currentUserAd}
            handleSendMessage={handleSendMessage}
          />
          </CardFooter>
          </CardFooter>
      </Card>
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
