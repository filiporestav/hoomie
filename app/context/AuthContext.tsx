// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, SupabaseClient, Session } from "@supabase/supabase-js";
import { createClient } from "../utils/supabase/client"; // Adjust the path as necessary

interface AuthContextType {
  user: User | null;
  supabase: SupabaseClient;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  supabase: createClient(),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient(); // Singleton client

  useEffect(() => {
    const fetchUser = async () => {
      //console.log("AuthProvider: Fetching user...");
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        //console.error("AuthProvider: Error fetching user:", error);
        setUser(null);
      } else {
        //console.log("AuthProvider: User fetched:", data.user);
        setUser(data.user);
      }
    };

    fetchUser();

    // Listen for authentication state changes
    const { data: subscriptionData } = supabase.auth.onAuthStateChange(
      (event: string, session: Session | null) => {
        //console.log(`AuthProvider: Auth event: ${event}`);
        //console.log("AuthProvider: Session:", session);
        setUser(session?.user ?? null);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscriptionData.subscription.unsubscribe();
      //console.log("AuthProvider: Auth subscription unsubscribed");
    };
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, supabase }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
