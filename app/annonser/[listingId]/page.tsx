'use client'

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import AdMap from "../../components/AdMap";
import Ad from "../../components/AdInterface";

export default function ListingPage() {
  const { listingId } = useParams();
  const [listing, setListing] = useState<Ad | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Retrieve the ad data from sessionStorage
    const storedAd = sessionStorage.getItem("selectedAd");
    if (storedAd) {
      const ad = JSON.parse(storedAd);
      // Only use the stored ad if the ID matches the listingId
      if (ad.id === listingId) {
        setListing(ad);
      }
    }
  }, [listingId]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  if (!listing) {
    return (
      <Card className="max-w-lg mx-auto mt-10">
        <CardContent className="text-center py-10">
          <p className="text-xl text-muted-foreground">Annonsen kunde inte hittas.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{listing.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2 space-y-4">
              <p className="text-lg">{listing.property_description}</p>
              <p className="text-muted-foreground">{listing.area_description}</p>
              <p className="text-sm">
                {listing.address}, {listing.city}, {listing.country}
              </p>
              <p className="text-sm">
                Tillgänglig för Byte: {formatDate(listing.availability_start)} - {formatDate(listing.availability_end)}
              </p>
              <p className="text-sm text-muted-foreground">
                Publicerad: {formatDate(listing.created_at)}
              </p>
            </div>
            <div className="md:w-1/2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <div className="grid grid-cols-2 gap-2 cursor-pointer">
                    {listing.image_urls.slice(0, 4).map((url, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={url}
                          alt={`Image of ${listing.property_description}`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
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
        <CardFooter className="flex justify-center">
          <Button onClick={() => window.history.back()}>
            Tillbaka till alla annonser
          </Button>
        </CardFooter>
      </Card>
      <div className="h-96 w-full">
        <AdMap ads={[listing]}  latitude={listing.latitude} longitude={listing.longitude}/>
      </div>
    </div>
  );
}
