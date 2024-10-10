export interface Listing {
  id: string;
  title: string;
  property_description: string;
  city: string;
  address: string;
  country: string;
  image_urls: string[];
}

export interface Message {
  id: number;
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
  };
  last_message: string;
  inserted_at: string;
  listing_id: string | null;
}
