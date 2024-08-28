"use client";

import React from "react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white font-bold text-xl">
              Semesterbyte
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link
                  href="/annonser"
                  className="text-white hover:bg-amber-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Annonser
                </Link>
                <Link
                  href="/hur-det-fungerar"
                  className="text-white hover:bg-amber-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Hur det fungerar
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-black bg-white hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logga in
              </Link>
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-amber-700 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-amber-800 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
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

      <div
        className={`${isOpen ? "block" : "hidden"} md:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/bostader"
            className="text-white hover:bg-amber-700 block px-3 py-2 rounded-md text-base font-medium"
          >
            Tillgängliga bostäder
          </Link>
          <Link
            href="/hur-det-fungerar"
            className="text-white hover:bg-amber-700 block px-3 py-2 rounded-md text-base font-medium"
          >
            Hur det fungerar
          </Link>

          <>
            <Link
              href="/login"
              className="text-white  hover:bg-amber-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              Logga in
            </Link>
          </>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
