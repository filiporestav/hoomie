// src/app/components/ChatLayout.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { ConversationsList } from './ConversationsList'
import { ChatWindow } from './ChatWindow'
import { PreviewAd } from './PreviewAd'
import { createClient } from '@/app/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Ad, UserProfile } from '@/app/types'

export default function ChatLayout() {
  const router = useRouter()
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const supabase = createClient();

  // Function to download avatars from Supabase storage
  const downloadAvatar = async (path: string | null) => {
    if (!path) return null
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error
      }
      return URL.createObjectURL(data)
    } catch (error) {
      console.error('Error downloading avatar:', error)
      return null
    }
  }

  // Fetch current user details
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: currentUserData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching current user:', error)
      } else {
        const avatarUrl = await downloadAvatar(currentUserData.avatar_url)
        setCurrentUser({ ...currentUserData, avatar_url: avatarUrl })
      }

      setLoading(false)
    }

    fetchCurrentUser()
  }, [router])

  // Handle conversation selection
  const handleConversationSelect = (conversationId: string, ad: Ad) => {
    setSelectedConversation(conversationId)
    setSelectedAd(ad)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="w-1/4 border-r border-border">
        <ConversationsList onConversationSelect={handleConversationSelect} currentUser={currentUser} />
      </div>
      <div className="w-2/4 border-r border-border">
        <ChatWindow selectedConversation={selectedConversation} currentUser={currentUser} />
      </div>
      <div className="w-1/4">
        <PreviewAd ad={selectedAd} />
      </div>
    </div>
  )
}
