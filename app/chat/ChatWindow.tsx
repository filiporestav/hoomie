// src/app/components/ChatWindow.tsx

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from 'lucide-react'
import { createClient } from '@/app/utils/supabase/client'
import { Message, UserProfile } from '@/app/types'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ChatWindowProps {
  selectedConversation: string | null
  currentUser: UserProfile | null
}

export function ChatWindow({ selectedConversation, currentUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [otherUser, setOtherUser] = useState<UserProfile | null>(null)
  const supabaseClient = createClient();
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Function to download avatars from Supabase storage
  const downloadAvatar = async (path: string | null) => {
    if (!path) return null
    try {
      const { data, error } = await supabaseClient.storage.from('avatars').download(path)
      if (error) {
        throw error
      }
      return URL.createObjectURL(data)
    } catch (error) {
      console.error('Error downloading avatar:', error)
      return null
    }
  }

  // Fetch messages for the selected conversation and download avatars
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation || !currentUser) return

      setLoading(true)

      // Fetch the conversation to get the other user's information
      const { data: convData, error: convError } = await supabaseClient
        .from('conversations')
        .select('user1, user2')
        .eq('id', selectedConversation)
        .single()

      if (convError) {
        console.error('Error fetching conversation:', convError)
        setLoading(false)
        return
      }

      const otherUserData = convData.user1.id === currentUser.id ? convData.user2 : convData.user1
      const avatarUrl = await downloadAvatar(otherUserData.avatar_url)
      setOtherUser({ ...otherUserData, avatar_url: avatarUrl })

      // Fetch messages
      const { data, error } = await supabaseClient
        .from('messages')
        .select('*, user:profiles(full_name, avatar_url)')
        .eq('conversation_id', selectedConversation)
        .order('inserted_at', { ascending: true })

      if (error) {
        console.error('Error fetching messages:', error)
        setLoading(false)
        return
      }

      if (data) {
        try {
          const formattedMessages: Message[] = await Promise.all(
            data.map(async (message: any) => {
              const avatarUrl = await downloadAvatar(message.user.avatar_url)
              return {
                ...message,
                user: {
                  ...message.user,
                  avatar_url: avatarUrl,
                },
              }
            })
          )
          setMessages(formattedMessages)
        } catch (error) {
          console.error('Error formatting messages:', error)
        }
      }

      setLoading(false)
    }

    fetchMessages()

    if (selectedConversation && currentUser) {
      const channel = supabaseClient
        .channel(`conversation:${selectedConversation}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${selectedConversation}`,
          },
          async (payload) => {
            const newMessage = payload.new as Message
            const avatarUrl = await downloadAvatar(newMessage.user.avatar_url)
            const formattedMessage = {
              ...newMessage,
              user: {
                ...newMessage.user,
                avatar_url: avatarUrl,
              },
            }
            setMessages((prev) => [...prev, formattedMessage])
          }
        )
        .subscribe()

      return () => {
        supabaseClient.removeChannel(channel)
      }
    }
  }, [selectedConversation, currentUser])

  // Scroll to bottom of messages on new message
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !selectedConversation) return

    const { error } = await supabaseClient
      .from('messages')
      .insert({
        content: newMessage,
        user_id: currentUser.id,
        conversation_id: selectedConversation,
      })

    if (error) {
      console.error('Error sending message:', error)
    } else {
      setNewMessage('')
    }
  }

  if (!selectedConversation) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <p>Select a conversation to start chatting.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading messages...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Card className="h-full flex flex-col">
        <CardHeader className="py-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            {otherUser && (
              <>
                <Avatar>
                  <AvatarImage src={otherUser.avatar_url || undefined} />
                  <AvatarFallback>{otherUser.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{otherUser.full_name}</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden py-2">
          <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.user_id === currentUser.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.user_id !== currentUser.id && (
                    <Avatar className="mr-2">
                      <AvatarImage src={message.user.avatar_url || undefined} />
                      <AvatarFallback>{message.user.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] p-2 rounded-2xl text-sm ${
                      message.user_id === currentUser.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.user_id === currentUser.id && (
                    <Avatar className="ml-2">
                      <AvatarImage src={currentUser.avatar_url || undefined} />
                      <AvatarFallback>{currentUser.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="py-2 border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex w-full gap-2"
          >
            <Input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button type="submit">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
