export interface Listing {
  id: string;
  title: string;
  property_description: string;
  area_description: string;
  city: string;
  address: string;
  country: string;
  image_urls: string[];
  availability_start: string;
  availability_end: string;
}

export interface Message {
  id: string;
  content: string;
  inserted_at: string;
  user_id: string;
  conversation_id: string;
  user: {
    full_name: string;
    avatar_url: string | null;
  };
}

export interface Conversation {
  id: string;
  other_user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    verified: boolean;
  };
  last_message: string;
  inserted_at: string;
  listing_id: string | null;
  exchange_suggested_by?: string | null;
  exchange_accepted_by?: string | null;
  suggested_date_start?: string | null;
  suggested_date_end?: string | null;
}

export interface User {
  id: string;
  full_name: string;
  avatar_url: string;
  // Add any other relevant fields
}

export interface Ad {
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
