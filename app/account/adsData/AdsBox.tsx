'use client'

import React, { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

interface AdsBoxProps {
  id: string
  title: string
  propertyDescription: string
  areaDescription: string
  address: string
  city: string
  country: string
  imageUrls: string[] | null
  availabilityStart: Date
  availabilityEnd: Date
  onEdit: (ad: any) => void
}

const AdsBox: React.FC<AdsBoxProps> = ({
  id,
  title,
  propertyDescription,
  areaDescription,
  address,
  city,
  country,
  imageUrls,
  availabilityStart,
  availabilityEnd,
  onEdit
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const formatDate = (date: Date | string) => {
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return date;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/2 space-y-4">
            <p className="text-sm text-muted-foreground">{address}, {city}, {country}</p>
            <p className="text-sm">{propertyDescription}</p>
            <p className="text-sm text-muted-foreground">{areaDescription}</p>
            <p className="text-sm font-semibold">
              Available for Switch: {formatDate(availabilityStart)} - {formatDate(availabilityEnd)}
            </p>
          </div>
          <div className="md:w-1/2">
            {Array.isArray(imageUrls) && imageUrls.length > 0 && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <div className="grid grid-cols-2 gap-2 cursor-pointer">
                    {imageUrls.slice(0, 4).map((url, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={url}
                          alt={`Ad Image ${index + 1}`}
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
                      {imageUrls.map((url, index) => (
                        <CarouselItem key={index}>
                          <div className="relative aspect-video">
                            <Image
                              src={url}
                              alt={`Ad Image ${index + 1}`}
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
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onEdit({ id, title, property_description: propertyDescription, area_description: areaDescription, address, city, country, image_urls: imageUrls, availability_start: availabilityStart, availability_end: availabilityEnd })}>
          Edit
        </Button>
      </CardFooter>
    </Card>
  )
}

export default AdsBox