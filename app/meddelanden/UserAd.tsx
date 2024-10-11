import { useEffect, useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { Listing } from './types';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserAdProps {
  userId: string;
}

export default function UserAd({ userId }: UserAdProps) {
  const [ad, setAd] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchUserAd() {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user ad:', error);
        setError('Failed to load the ad. Please try again later.');
      } else {
        setAd(data);
      }

      setIsLoading(false);
    }

    if (userId) {
      fetchUserAd();
    }
  }, [userId]);

  if (isLoading) {
    return <div className="w-[300px] text-center p-4">Loading ad...</div>;
  }

  if (error) {
    return <div className="w-[300px] text-center text-red-500 p-4">{error}</div>;
  }

  if (!ad) {
    return <div className="w-[300px] text-center p-4">No ad found for this user.</div>;
  }

  return (
    <div className="w-[350px] h-full flex flex-col">
      <ScrollArea className="flex-grow">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">{ad.title}</h2>
          <Carousel className="w-4/5 max-w-[280px] mx-auto mb-4">
            <CarouselContent>
              {ad.image_urls.map((url, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-square">
                    <Image
                      src={url || '/placeholder.svg'}
                      alt={`${ad.title} - Image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Fastigheten</h3>
              <p className="text-sm text-muted-foreground">{ad.property_description}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Området</h3>
              <p className="text-sm text-muted-foreground">{ad.area_description}</p>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{ad.city}</Badge>
              <span className="text-sm text-muted-foreground">{ad.country}</span>
            </div>
            <p className="text-sm">{ad.address}</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}