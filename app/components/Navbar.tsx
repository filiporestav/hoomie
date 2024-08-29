"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "../utils/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
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
  });

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
      return;
    }
    // Refresh the page to clear the user state
    router.push("/login");
  };

  return (
    <nav className="bg-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white font-bold text-2xl">
              Semesterbyte
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            <Link
              href="/annonser"
              className="text-white hover:bg-amber-700 px-3 py-2 rounded-md text-lg font-medium"
            >
              Annonser
            </Link>
            <Link
              href="/hur-det-fungerar"
              className="text-white hover:bg-amber-700 px-3 py-2 rounded-md text-lg font-medium"
            >
              Hur det fungerar
            </Link>

            {user ? (
              <div className="relative">
                <button
                  className="text-white hover:bg-amber-700 px-3 py-2 rounded-md text-lg font-medium focus:outline-none"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  Min profil
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Min profil
                    </Link>
                    <Link
                      href="/mina-bostader"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mina bostäder
                    </Link>
                    <form action="/auth/signout" method="post">
                      <button
                        className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                        type="submit"
                      >
                        Logga ut
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white hover:bg-amber-700 px-3 py-2 rounded-md text-lg font-medium"
                >
                  Logga in
                </Link>
                <Link
                  href="/register"
                  className="text-white hover:bg-amber-700 px-3 py-2 rounded-md text-lg font-medium"
                >
                  Registrera dig
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-amber-700 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-amber-800 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen ? "true" : "false"}
            >
              <span className="sr-only">Öppna huvudmeny</span>
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3`}
        id="mobile-menu"
      >
        <Link
          href="/annonser"
          className="text-white hover:bg-amber-700 block px-3 py-2 rounded-md text-base font-medium"
        >
          Annonser
        </Link>
        <Link
          href="/hur-det-fungerar"
          className="text-white hover:bg-amber-700 block px-3 py-2 rounded-md text-base font-medium"
        >
          Hur det fungerar
        </Link>

        {user ? (
          <>
            <Link
              href="/min-profil"
              className="text-white hover:bg-amber-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Min profil
            </Link>
            <Link
              href="/mina-bostader"
              className="text-white hover:bg-amber-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Mina bostäder
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-white hover:bg-amber-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Logga in
            </Link>
            <Link
              href="/register"
              className="text-white hover:bg-amber-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Registrera dig
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
