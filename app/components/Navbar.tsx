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
import { Separator } from "@/components/ui/separator";
import Image from 'next/image';

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
    <nav className="bg-background p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/hoomie_logo.jpg"
            alt="Hoomie Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="text-indigo-600 font-bold text-2xl">hoomie</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden font-bold md:flex items-center space-x-4">
          <Link href="/annonser" className="bg-background text-primary hover:text-primary/80 transition-colors duration-200">
            Annonser
          </Link>
          <Link href="/hur-det-fungerar" className="bg-background text-primary hover:text-primary/80 transition-colors duration-200">
            Hur det fungerar
          </Link>
          {user ? (
            <>
              <Link href="/account" className="bg-background text-primary hover:text-primary/80 transition-colors duration-200">
                Profil
              </Link>
              <Link href="/conversations" className="bg-background text-primary hover:text-primary/80 transition-colors duration-200">
                <IoChatbubbleEllipsesOutline className="w-6 h-6" />
              </Link>
              <Button variant="ghost" className="bg-background text-primary hover:text-primary/80 transition-colors duration-200" onClick={handleLogout}>
                Logga ut
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-indigo-700 hover:text-indigo-500">
                Logga in
              </Link>
              <Link href="/register" className="text-indigo-700 hover:text-indigo-500">
                Registrera dig
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-indigo-700">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Öppna meny</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-gray-100 text-indigo-700">
            <nav className="flex flex-col space-y-4">
              <Link href="/annonser" className="text-lg hover:text-indigo-500">
                Annonser
              </Link>
              <Link href="/hur-det-fungerar" className="text-lg hover:text-indigo-500">
                Hur det fungerar
              </Link>
              {user ? (
                <>
                  <Link href="/account" className="text-lg hover:text-indigo-500">
                    Profil
                  </Link>
                  <Link href="/conversations" className="text-lg hover:text-indigo-500">
                    Konversationer
                  </Link>
                  <Button variant="ghost" className="text-lg text-indigo-700 hover:text-indigo-500" onClick={handleLogout}>
                    Logga ut
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-lg hover:text-indigo-500">
                    Logga in
                  </Link>
                  <Link href="/register" className="text-lg hover:text-indigo-500">
                    Registrera dig
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      <Separator orientation="horizontal" className="bg-indigo-600 h-0.5 w-full"/>

    </nav>
  );
};

export default Navbar;