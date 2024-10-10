"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "../utils/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

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
  }, [supabase.auth]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
      return;
    }
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-md pt-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8">
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
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/annonser"
            className="text-gray-800 hover:text-indigo-600 transition-colors duration-200"
          >
            Annonser
          </Link>
          <Link
            href="/hur-det-fungerar"
            className="text-gray-800 hover:text-indigo-600 transition-colors duration-200"
          >
            Hur det fungerar
          </Link>
          {user ? (
            <>
              <Link
                href="/konto"
                className="text-gray-800 hover:text-indigo-600 transition-colors duration-200"
              >
                Mitt konto
              </Link>
              <Link
                href="/meddelanden"
                className="text-gray-800 hover:text-indigo-600 transition-colors duration-200"
              >
                <IoChatbubbleEllipsesOutline className="w-6 h-6" />
              </Link>
              <Button
                variant="outline"
                className="text-gray-800 hover:text-indigo-600 border-gray-300 transition-colors duration-200"
                onClick={handleLogout}
              >
                Logga ut
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/logga-in"
                className="text-indigo-600 hover:text-indigo-400 transition-colors duration-200"
              >
                Logga in
              </Link>
              <Link
                href="/skapa-konto"
                className="text-indigo-600 hover:text-indigo-400 transition-colors duration-200"
              >
                Registrera dig
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-indigo-600"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Öppna meny</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-white text-indigo-600">
            <nav className="flex flex-col space-y-4">
              <Link href="/annonser" className="text-lg hover:text-indigo-400">
                Annonser
              </Link>
              <Link
                href="/hur-det-fungerar"
                className="text-lg hover:text-indigo-400"
              >
                Hur det fungerar
              </Link>
              {user ? (
                <>
                  <Link href="/konto" className="text-lg hover:text-indigo-400">
                    Mitt konto
                  </Link>
                  <Link
                    href="/meddelanden"
                    className="text-lg hover:text-indigo-400"
                  >
                    Konversationer
                  </Link>
                  <Button
                    variant="ghost"
                    className="text-lg text-indigo-600 hover:text-indigo-400"
                    onClick={handleLogout}
                  >
                    Logga ut
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/logga-in"
                    className="text-lg hover:text-indigo-400"
                  >
                    Logga in
                  </Link>
                  <Link
                    href="/skapa-konto"
                    className="text-lg hover:text-indigo-400"
                  >
                    Registrera dig
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      <Separator
        orientation="horizontal"
        className="bg-indigo-600 h-0.5 w-full mt-4"
      />
    </nav>
  );
};

export default Navbar;
