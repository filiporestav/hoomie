export default interface Ad {
    id: string;
    property_description: string;
    area_description: string;
    address: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    image_urls: string[];
    created_at: Date; // Make sure this is the correct field name
    availability_start: Date;
    availability_end: Date;
    title: string;
    user_id?: string;
  }
  