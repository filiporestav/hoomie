import { createClient } from "../utils/supabase/client";

type Listing = {
  id: number;
  propertyDescription: string;
  areaDescription: string;
  city: string;
  country: string;
  imageUrls: string[];
  createdAt: string; // Add created_at
  user_id: string;
};

// Function to fetch a listing by ID
export const fetchListingById = async (id: string): Promise<Listing | null> => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("ads")
      .select(
        "id, property_description, area_description, city, country, image_urls, created_at, user_id"
      )
      .eq("id", id) // Fetch based on the listing ID
      .single(); // Ensure only one result is returned

    if (error) {
      console.error("Error fetching listing by ID from Supabase:", error);
      throw error;
    }

    if (!data) {
      console.error("Listing not found");
      return null;
    }

    // Map the data to your Listing type
    const listing: Listing = {
      id: data.id,
      propertyDescription:
        data.property_description || "No description available",
      areaDescription: data.area_description || "No area description available",
      city: data.city || "Unknown city",
      country: data.country || "Unknown country",
      imageUrls: data.image_urls || [], // Ensure it's an array
      createdAt: data.created_at, // Include the created_at field
      user_id: data.user_id,
    };

    console.log("Fetched listing:", listing);
    return listing;
  } catch (error) {
    console.error("Error in fetchListingById:", error);
    return null;
  }
};
