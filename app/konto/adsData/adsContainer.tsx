import { useCallback, useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";
import { PlusCircle } from "lucide-react";
import AddEditAdModal from "./AddEditAdModal";
import { createClient } from "../../utils/supabase/client";
import AdsBox from "./AdsBox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

export default function AdsContainer({ user }: { user: User | null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ads, setAds] = useState<any[]>([]);
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalAction, setModalAction] = useState<"add" | "edit">("add");

  const handleOpenModal = (action: "add" | "edit", ad?: any) => {
    setModalAction(action);
    setSelectedAd(ad || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAd(null);
  };

  const handleAdUpdated = () => fetchAds();
  const handleAdDeleted = () => fetchAds();
  const handleAdAdded = () => fetchAds();

  const fetchAds = useCallback(async () => {
    if (!user) return;

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
  }, [user]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      
      <Card className="bg-background">
        <CardContent className="p-6">
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div >
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="w-full h-64 rounded-lg" />
                ))
              ) : ads.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <h3 className="text-2xl font-semibold mb-2">
                    Inga annonser ute
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Skapa en ny annons för att börja synas på hemsidan!
                  </p>
                  <Button
                    onClick={() => handleOpenModal("add")}
                    className="flex items-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Lägg upp ny annons
                  </Button>
                </div>
              ) : (
                ads.map((ad) => (
                  <div
                    key={ad.id}
                    className="transform transition-all duration-200 hover:scale-102"
                  >
                    <AdsBox
                      id={ad.id}
                      title={ad.title}
                      propertyDescription={ad.property_description}
                      areaDescription={ad.area_description}
                      address={ad.address}
                      city={ad.city}
                      country={ad.country}
                      imageUrls={ad.image_urls}
                      availabilityStart={ad.availability_start}
                      availabilityEnd={ad.availability_end}
                      onEdit={() => handleOpenModal("edit", ad)}
                    />
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <AddEditAdModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={user}
        ad={selectedAd}
        onAdAdded={handleAdAdded}
        onAdUpdated={handleAdUpdated}
        onAdDeleted={handleAdDeleted}
        action={modalAction}
      />
    </div>
  );
}
