"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaSearch, FaInfoCircle } from "react-icons/fa";
import { BsArrowRightCircle } from "react-icons/bs";
import { fetchListings } from "./annonser/fetchListings";
import Ad from "./components/AdInterface";
import AdMap from "./components/AdMap";

export default function Home() {
  const [listings, setLatestListings] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen flex flex-col bg-indigo-50">
      {/* Header with Background Image */}
      <header
        className="w-full h-[70vh] bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/header-bg.jpg')" }}
      >
        <div className="bg-indigo-900 bg-opacity-70 w-full h-full flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-6xl font-bold mb-4">Välkommen till Hoomie</h1>
          <p className="text-2xl mb-6">
            Byt ditt studentboende med andra studenter
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/annonser"
              className="px-8 py-4 bg-indigo-600 text-white rounded-full flex items-center space-x-2 text-lg hover:bg-indigo-700 transition"
            >
              <FaSearch />
              <span>Utforska annonser</span>
            </Link>
            <Link
              href="/hur-det-fungerar"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full flex items-center space-x-2 text-lg hover:bg-white hover:text-indigo-600 transition"
            >
              <FaInfoCircle />
              <span>Så fungerar det</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-indigo-900">
            Hitta ditt nästa resmål
          </h2>
          <div className="flex justify-center mb-8">
            <input
              type="text"
              placeholder="Sök plats, t.ex. Stockholm, Gotland..."
              className="w-full max-w-3xl p-4 border border-indigo-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button className="px-6 py-4 bg-indigo-600 text-white rounded-r-full hover:bg-indigo-700 transition">
              <FaSearch />
            </button>
          </div>
          <Link href="/annonser" className="text-indigo-600 hover:underline">
            <BsArrowRightCircle className="inline mr-2" /> Se alla annonser
          </Link>
        </div>
      </section>

      {/* Featured Section with Latest Listings */}
      <section className="py-10 bg-indigo-50">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-6 text-indigo-900">
            Senaste annonserna
          </h3>
          {loading ? (
            <p className="text-indigo-500">Laddar annonser...</p>
          ) : (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <AdMap ads={listings} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}