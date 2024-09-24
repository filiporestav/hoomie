export const geocodeAddress = async (address: string, city: string, country: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      throw new Error("Google Maps API key is missing!");
    }
  
    const formattedAddress = `${address}, ${city}, ${country}`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(formattedAddress)}&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      console.log("Geocode API response:", data);  // Log the full response
  
      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        console.error("Geocode API error:", data);  // Log any error details
        throw new Error("Failed to fetch geocode data.");
      }
    } catch (error) {
      console.error("Error fetching geocode:", error);
      throw error;
    }
  };
  