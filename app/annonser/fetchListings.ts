// app/annonser/fetchListings.ts
import { createClient } from "../utils/supabase/client";

type Listing = {
  id: number;
  propertyDescription: string;
  areaDescription: string;
  location: string;
  country: string;
  imageUrls: string[];
};

export const fetchListings = async (): Promise<Listing[]> => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("ads")
      .select("id, property_description, area_description, location, country, image_urls");
    if (error) throw error;

    return data.map((ad: any) => ({
      id: ad.id,
      propertyDescription: ad.property_description,
      areaDescription: ad.area_description,
      location: ad.location,
      country: ad.country,
      imageUrls: ad.image_urls, // Assuming image_urls is an array of strings
    }));
  } catch (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
};
