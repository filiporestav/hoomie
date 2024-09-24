"use client";

import { useCallback, useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";
import AddAdModal from "./AddAdModal";
import EditAdModal from "./EditAdModal";
import { createClient } from "../../utils/supabase/client";
import AdsBox from "./AdsBox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    fetchAds();
  };

  const handleAdDeleted = () => {
    fetchAds();
  };

  const handleAdAdded = () => {
    fetchAds();
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
    <Card>
      <CardHeader>
        <CardTitle>My Ads</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleOpenModal} className="w-full mb-6">
          Add New Ad
        </Button>

        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-auto">
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
                address={ad.address}
                city={ad.city}
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
      </CardContent>
    </Card>
  );
}