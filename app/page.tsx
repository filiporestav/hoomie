"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaSearch, FaInfoCircle } from "react-icons/fa";
import { BsArrowRightCircle } from "react-icons/bs";
import { fetchListings } from "./annonser/fetchListings";
import Ad from "./components/AdInterface";
import { useRouter } from "next/navigation";

export default function Home() {
  const [listings, setLatestListings] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        const fetchedListings = await fetchListings();
        setLatestListings(fetchedListings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header Section */}
      <header
        className="relative w-full h-[60vh] bg-cover bg-center"
        style={{ backgroundImage: "url('/header-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative w-full h-full flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Välkommen till Hoomies
          </h1>
          <p className="text-lg md:text-2xl mb-6 max-w-2xl">
            Byt hem, dela äventyr - upptäck Sverige tillsammans
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <Link
              href="/annonser"
              className="px-8 py-3 md:py-4 bg-indigo-600 text-white rounded-full flex items-center space-x-2 text-lg hover:bg-indigo-700 transition-all"
            >
              <FaSearch />
              <span>Utforska annonser</span>
            </Link>
            <Link
              href="/hur-det-fungerar"
              className="px-8 py-3 md:py-4 bg-transparent border-2 border-white text-white rounded-full flex items-center space-x-2 text-lg hover:bg-white hover:text-indigo-600 transition-all"
            >
              <FaInfoCircle />
              <span>Så fungerar det</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Latest Listings Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-8 text-indigo-900">
            Senaste annonserna
          </h3>
          {loading ? (
            <p className="text-indigo-600">Laddar annonser...</p>
          ) : listings.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {listings.map((listing, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer"
                  onClick={() => router.push(`/annonser/${listing.id}`)}
                >
                  <div className="relative w-full h-48 mb-4">
                    {listing.image_urls.length ? (
                      <img
                        src={listing.image_urls[0]}
                        alt={listing.title}
                        className="object-cover object-center w-full h-full rounded-lg"
                      />
                    ) : (
                      <div className="bg-gray-200 w-full h-full rounded-lg flex items-center justify-center text-gray-500">
                        Inga bilder tillgängliga
                      </div>
                    )}
                  </div>
                  <h4 className="text-xl font-semibold mb-2">
                    {listing.title}
                  </h4>
                  <p className="text-gray-700">
                    {listing.address}, {listing.city}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-indigo-600">
              Inga annonser tillgängliga just nu.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
