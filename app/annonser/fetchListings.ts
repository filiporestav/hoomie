import { createClient } from "../utils/supabase/client";

type Listing = {
  id: number;
  propertyDescription: string;
  areaDescription: string;
  location: string;
  country: string;
  imageUrls: string[];
  createdAt: string; // Add created_at
};

export const fetchListings = async (): Promise<Listing[]> => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("ads")
      .select(
        "id, property_description, area_description, location, country, image_urls, created_at"
      );

    if (error) {
      console.error("Error fetching data from Supabase:", error);
      throw error;
    }

    // console.log("Fetched data from Supabase:", data);

    const listings: Listing[] = data.map((ad: any) => {
      const listing = {
        id: ad.id,
        propertyDescription:
          ad.property_description || "No description available",
        areaDescription: ad.area_description || "No area description available",
        location: ad.location || "Unknown location",
        country: ad.country || "Unknown country",
        imageUrls: ad.image_urls || [], // Ensure it's an array
        createdAt: ad.created_at, // Include the created_at field
      };
      console.log("Mapped listing:", listing);
      return listing;
    });

    return listings;
  } catch (error) {
    console.error("Error in fetchListings:", error);
    return [];
  }
};
