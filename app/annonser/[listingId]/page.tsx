"use client";
// app/listings/[id]/page.tsx

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchListingById } from "../fetchListingById";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import Modal from "react-modal";

type Listing = {
  id: number;
  propertyDescription: string;
  areaDescription: string;
  city: string;
  country: string;
  imageUrls: string[];
  createdAt: string;
};

const ListingPage = () => {
  const { listingId } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (listingId) {
      const loadListing = async () => {
        try {
          setLoading(true);
          const fetchedListing = await fetchListingById(listingId as string);
          setListing(fetchedListing);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching listing:", error);
          setLoading(false);
        }
      };

      loadListing();
    }
  }, [listingId]);

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  if (!listing) {
    return (
      <p className="text-center mt-10 text-xl text-gray-600">
        Annonsen kunde inte hittas.
      </p>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Property Description Section */}
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          {listing.propertyDescription}
        </h1>
        <p className="text-xl text-gray-600">{listing.areaDescription}</p>
        <p className="text-md text-gray-500 mt-1">
          {listing.city}, {listing.country}
        </p>
      </div>

      {/* Image Gallery Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {listing.imageUrls.map((url, index) => (
          <div key={index} className="relative group">
            <Image
              src={url}
              alt={`Image of ${listing.propertyDescription}`}
              width={500}
              height={300}
              className="rounded-lg shadow-lg transition-transform transform group-hover:scale-105 cursor-pointer"
              onClick={() => openModal(url)}
            />
            <div
              className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg cursor-pointer"
              onClick={() => openModal(url)}
            >
              <p className="text-white font-bold">Förstora</p>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Image Modal"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="relative w-11/12 md:w-2/3 lg:w-1/2">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white text-xl font-bold p-2"
            >
              &times;
            </button>
            <Image
              src={selectedImage}
              alt="Selected Image"
              width={1000}
              height={600}
              className="rounded-lg shadow-lg"
            />
          </div>
        </Modal>
      )}

      {/* Posted Date */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-400">
          Publicerad: {new Date(listing.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Back to Listings Button */}
      <div className="mt-8 flex justify-center">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          onClick={() => window.history.back()}
        >
          Tillbaka till alla annonser
        </button>
      </div>
    </div>
  );
};

export default ListingPage;
