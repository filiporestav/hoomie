"use client";
import { useCallback, useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";
import AddAdModal from "./AddAdModal";
import EditAdModal from "./EditAdModal";
import { createClient } from "../../utils/supabase/client";
import AdsBox from "./AdsBox";

export default function AdsContainer({ user }: { user: User | null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ads, setAds] = useState<any[]>([]);
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenEditModal = (ad: any) => {
    setSelectedAd(ad);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setSelectedAd(null);
    setIsEditModalOpen(false);
  };

  const handleAdUpdated = () => {
    fetchAds(); // Refresh the ads list after update
  };

  const handleAdDeleted = () => {
    fetchAds(); // Refresh the ads list after delete
  };

  const handleAdAdded = () => {
    fetchAds(); // Refresh the ads list after adding a new ad
  };

  const fetchAds = useCallback(async () => {
    if (user) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching ads:", error.message);
      } else {
        setAds(data || []);
      }

      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  return (
    <div className="ml-0 mt-10 p-6 bg-white rounded-lg shadow-md flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Ads</h2>
        <button
          className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
          onClick={handleOpenModal}
        >
          Add New Ad
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 max-h-[calc(100vh-200px)] overflow-auto">
        {loading ? (
          <p>Loading ads...</p>
        ) : ads.length === 0 ? (
          <p>No ads found.</p>
        ) : (
          ads.map((ad) => (
            <AdsBox
              key={ad.id}
              id={ad.id}
              propertyDescription={ad.property_description}
              areaDescription={ad.area_description}
              location={ad.location}
              country={ad.country}
              imageUrls={ad.image_urls}
              onEdit={() => handleOpenEditModal(ad)}
            />
          ))
        )}
      </div>

      <AddAdModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={user}
        onAdAdded={handleAdAdded}
      />

      {selectedAd && (
        <EditAdModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          user={user}
          ad={selectedAd}
          onAdUpdated={handleAdUpdated}
          onAdDeleted={handleAdDeleted}
        />
      )}
    </div>
  );
}
