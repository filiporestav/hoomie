// app/annonser/fetchListings.ts
type Listing = {
  id: number;
  title: string;
  location: string;
  availabilityWeeks: string[];
  image: string;
};

export const fetchListings = async (): Promise<Listing[]> => {
  // Replace this with actual data fetching logic
  return [
    {
      id: 1,
      title: "Cozy Cottage in the Mountains",
      location: "Aspen, CO",
      availabilityWeeks: ["2024-W01", "2024-W02", "2024-W03"],
      image: "/images/aspen-cottage.jpg",
    },
    {
      id: 2,
      title: "Beachfront Villa",
      location: "Malibu, CA",
      availabilityWeeks: ["2024-W03", "2024-W04"],
      image: "/images/malibu-villa.jpg",
    },
    {
      id: 3,
      title: "Urban Apartment",
      location: "New York, NY",
      availabilityWeeks: ["2024-W02", "2024-W05"],
      image: "/images/nyc-apartment.jpg",
    },
  ];
};
