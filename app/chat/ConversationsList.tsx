// src/app/components/ConversationsList.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from '@/app/utils/supabase/client'
import { Conversation, UserProfile, Ad } from '@/app/types'

interface ConversationsListProps {
  onConversationSelect: (conversationId: string, ad: Ad) => void
  currentUser: UserProfile | null
}

export function ConversationsList({ onConversationSelect, currentUser }: ConversationsListProps) {
  const [conversations, setConversations] = useState<ConversationWithAd[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const supabase = createClient();

  interface ConversationWithAd extends Conversation {
    ad: Ad
  }

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

  // Fetch conversations and download avatars
  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser) return

      setLoading(true)

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          user1 (
            id,
            full_name,
            avatar_url
          ),
          user2 (
            id,
            full_name,
            avatar_url
          ),
          messages (
            content,
            inserted_at
          )
        `)
        .or(`user1.id.eq.${currentUser.id},user2.id.eq.${currentUser.id}`)
        .order('messages.inserted_at', { ascending: false })

      if (error) {
        console.error('Error fetching conversations:', error)
        setLoading(false)
        return
      }

      if (data) {
        try {
          const formattedConversations: ConversationWithAd[] = await Promise.all(
            data.map(async (conv: any) => {
              const otherUser = conv.user1.id === currentUser.id ? conv.user2 : conv.user1
              const avatarUrl = await downloadAvatar(otherUser.avatar_url)

              // Replace with actual ad fetching logic based on your data structure
              const ad: Ad = {
                id: conv.id,
                property_description: 'Sample property description',
                area_description: 'Sample area description',
                address: '123 Beach Ave',
                city: 'Beach City',
                country: 'Countryland',
                latitude: 0,
                longitude: 0,
                image_urls: ['/placeholder.svg'],
                created_at: new Date(),
                availability_start: new Date(),
                availability_end: new Date(),
                title: 'Beach House',
              }

              return {
                id: conv.id,
                other_user: { ...otherUser, avatar_url: avatarUrl },
                last_message: conv.messages[0]?.content || '',
                inserted_at: conv.messages[0]?.inserted_at || '',
                ad,
              }
            })
          )
          setConversations(formattedConversations)
        } catch (error) {
          console.error('Error formatting conversations:', error)
        }
      }

      setLoading(false)
    }

    fetchConversations()
  }, [currentUser])


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading conversations...</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="p-4 rounded-lg bg-card hover:bg-accent cursor-pointer"
            onClick={() => onConversationSelect(conv.id, conv.ad)}
          >
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={conv.other_user.avatar_url || undefined} />
                <AvatarFallback>{conv.other_user.full_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{conv.other_user.full_name}</h3>
                <p className="text-sm text-muted-foreground truncate">{conv.last_message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
