"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "../utils/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getting user:", error);
        return;
      }
      setUser(data.user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
      return;
    }
    router.push("/login");
  };

  return (
    <nav className="bg-indigo-700 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-2xl">
          Hoomie
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/annonser" className="text-white hover:text-indigo-200">
            Annonser
          </Link>
          <Link href="/hur-det-fungerar" className="text-white hover:text-indigo-200">
            Hur det fungerar
          </Link>
          {user ? (
            <>
              <Link href="/account" className="text-white hover:text-indigo-200">
                Profil
              </Link>
              <Link href="/conversations" className="text-white hover:text-indigo-200">
                <IoChatbubbleEllipsesOutline className="w-6 h-6" />
              </Link>
              <Button variant="ghost" className="text-white hover:text-indigo-200" onClick={handleLogout}>
                Logga ut
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white hover:text-indigo-200">
                Logga in
              </Link>
              <Link href="/register" className="text-white hover:text-indigo-200">
                Registrera dig
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-white">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Öppna meny</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-indigo-700 text-white">
            <nav className="flex flex-col space-y-4">
              <Link href="/annonser" className="text-lg hover:text-indigo-200">
                Annonser
              </Link>
              <Link href="/hur-det-fungerar" className="text-lg hover:text-indigo-200">
                Hur det fungerar
              </Link>
              {user ? (
                <>
                  <Link href="/account" className="text-lg hover:text-indigo-200">
                    Profil
                  </Link>
                  <Link href="/conversations" className="text-lg hover:text-indigo-200">
                    Konversationer
                  </Link>
                  <Button variant="ghost" className="text-lg text-white hover:text-indigo-200" onClick={handleLogout}>
                    Logga ut
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-lg hover:text-indigo-200">
                    Logga in
                  </Link>
                  <Link href="/register" className="text-lg hover:text-indigo-200">
                    Registrera dig
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;