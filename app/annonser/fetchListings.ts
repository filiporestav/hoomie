import { createBrowserSupabaseClient } from "../utils/supabase/client";
import Ad from "../components/AdInterface"

export const fetchListings = async (): Promise<Ad[]> => {
  const supabase = createBrowserSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("ads")
      .select(
        "*"
      );

    if (error) {
      console.error("Error fetching data from Supabase:", error);
      throw error;
    }

    // console.log("Fetched data from Supabase:", data);

    const listings: Ad[] = data.map((ad: any) => {
      const listing = {
        id: ad.id,
        property_description:
          ad.property_description || "No description available",
        area_description: ad.area_description || "No area description available",
        address: ad.address,
        city: ad.city || "Unknown city",
        country: ad.country || "Unknown country",
        longitude: ad.longitude,
        latitude: ad.latitude,
        image_urls: ad.image_urls || [], // Ensure it's an array
        created_at: ad.created_at, // Include the created_at field
        availability_start: ad.availability_start,
        availability_end: ad.availability_end,
        title: ad.title,
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
