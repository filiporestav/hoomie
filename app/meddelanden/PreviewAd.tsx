'use client'

import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Ad } from '@/app/types'

interface PreviewAdProps {
  ad: Ad | null
}

export function PreviewAd({ ad }: PreviewAdProps) {
  if (!ad) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p>Select an ad to view details</p>
        </CardContent>
      </Card>
    )
  }

  // Log the ad data for debugging
  console.log('Ad data:', ad);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{ad.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel className="w-full max-w-xs mx-auto">
          <CarouselContent>
            {ad.image_urls.length > 0 ? ( // Check if there are images
              ad.image_urls.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Image
                      src={image}
                      alt={`Ad image ${index + 1}`}
                      width={300}
                      height={200}
                      className="w-full object-cover rounded-md"
                    />
                  </div>
                </CarouselItem>
              ))
            ) : (
              <p>No images available for this ad.</p> // Fallback message if no images
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <ScrollArea className="h-[calc(100vh-400px)] mt-4">
          <div className="space-y-4">
            <p><strong>Price:</strong> ${ad.title}</p> {/* Ensure property matches your ad structure */}
            <p><strong>Location:</strong> {ad.address}, {ad.city}, {ad.country}</p>
            <p><strong>Description:</strong> {ad.area_description}</p> {/* Ensure property matches your ad structure */}
            <p><strong>Area:</strong> {ad.area_description}</p>
            <p><strong>Availability:</strong> {new Date(ad.availability_start).toLocaleDateString()} - {new Date(ad.availability_end).toLocaleDateString()}</p>
            {/* Add more ad details here */}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
