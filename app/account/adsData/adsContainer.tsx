'use client'

import { useCallback, useEffect, useState } from "react"
import { type User } from "@supabase/supabase-js"
import AddEditAdModal from "./AddEditAdModal"
import { createClient } from "../../utils/supabase/client"
import AdsBox from "./AdsBox"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AdsContainer({ user }: { user: User | null }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [ads, setAds] = useState<any[]>([])
  const [selectedAd, setSelectedAd] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [modalAction, setModalAction] = useState<'add' | 'edit'>('add')

  const handleOpenModal = (action: 'add' | 'edit', ad?: any) => {
    setModalAction(action)
    setSelectedAd(ad || null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedAd(null)
  }

  const handleAdUpdated = () => {
    fetchAds()
  }

  const handleAdDeleted = () => {
    fetchAds()
  }

  const handleAdAdded = () => {
    fetchAds()
  }

  const fetchAds = useCallback(async () => {
    if (user) {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("user_id", user.id)

      if (error) {
        console.error("Error fetching ads:", error.message)
      } else {
        setAds(data || [])
      }

      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchAds()
  }, [fetchAds])

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-6 p-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="w-full h-48" />
              ))
            ) : ads.length === 0 ? (
              <p className="text-center text-muted-foreground">No ads found.</p>
            ) : (
              ads.map((ad) => (
                <div key={ad.id} className="w-full">
                  <AdsBox
                    key={ad.id}
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
                    onEdit={() => handleOpenModal('edit', ad)}
                  />
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="p-6">
        <Button onClick={() => handleOpenModal('add')} className="w-full">
          Add New Ad
        </Button>
      </div>

      <AddEditAdModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={user}
        ad={selectedAd}
        onAdAdded={handleAdAdded}
        onAdUpdated={handleAdUpdated}
        onAdDeleted={handleAdDeleted}
        action={selectedAd ? 'edit' : 'add'}
      />
    </div>
  )
}