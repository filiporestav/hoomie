// src/app/types.ts

export interface UserProfile {
    id: string
    full_name: string
    avatar_url: string | null
  }
  
  export interface Message {
    id: number
    content: string
    inserted_at: string
    user_id: string
    conversation_id: string
    user: UserProfile
  }
  
  export interface Conversation {
    id: string
    other_user: UserProfile
    last_message: string
    inserted_at: string
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
  
  