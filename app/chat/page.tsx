'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/app/utils/supabase/client"
import { Send } from "lucide-react"

interface Message {
  id: number
  content: string
  inserted_at: string
  user_id: string
  conversation_id: string
  user: {
    full_name: string
    avatar_url: string | null
  }
}

interface Conversation {
  id: string
  other_user: {
    id: string
    full_name: string
    avatar_url: string | null
  }
  last_message: string
  inserted_at: string
}

const ChatPage = () => {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const supabase = createClient()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

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
        setCurrentUser(currentUserData)
      }
    }

    fetchCurrentUser()
  }, [router, supabase])

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser) return

      const { data, error } = await supabase
        .from('conversations')
        .select(
          'id, user1(id, full_name, avatar_url), user2(id, full_name, avatar_url), messages(content, inserted_at)'
        )
        .or(`user1.eq.${currentUser.id},user2.eq.${currentUser.id}`)
        .order('inserted_at', { foreignTable: 'messages', ascending: false })

      if (error) {
        console.error('Error fetching conversations:', error)
      } else if (data) {
        const formattedConversations = data.map((conv: any) => ({
          id: conv.id,
          other_user: conv.user1.id === currentUser.id ? conv.user2 : conv.user1,
          last_message: conv.messages[0]?.content || '',
          inserted_at: conv.messages[0]?.inserted_at || ''
        }))
        setConversations(formattedConversations)
      }
    }

    fetchConversations()
  }, [currentUser, supabase])

  // Fetch messages for the selected conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return

      const { data, error } = await supabase
        .from('messages')
        .select('*, user:profiles(full_name, avatar_url)')
        .eq('conversation_id', selectedConversation)
        .order('inserted_at', { ascending: true })

      if (error) {
        console.error('Error fetching messages:', error)
      } else if (data) {
        setMessages(data)
      }
    }

    fetchMessages()

    const channel = supabase
      .channel(`conversation:${selectedConversation}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation}`
        }, 
        (payload) => {
          const newMessage = payload.new as Message
          setMessages(prev => [...prev, newMessage])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedConversation, supabase])

  // Scroll to bottom of messages on new message
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser || !selectedConversation) return

    const { error } = await supabase
      .from('messages')
      .insert({
        content: newMessage,
        user_id: currentUser.id,
        conversation_id: selectedConversation
      })

    if (error) console.error('Error sending message:', error)
    else {
      setNewMessage('')
    }
  }

  return (
    <div className="flex h-[80vh] bg-background"> {/* Changed to 80vh */}
      {/* Sidebar for conversations */}
      <div className="w-1/4 border-r border-border">
        <ScrollArea className="h-full">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-4 cursor-pointer hover:bg-accent ${selectedConversation === conv.id ? 'bg-accent' : ''}`}
              onClick={() => setSelectedConversation(conv.id)}
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={conv.other_user.avatar_url || undefined} />
                  <AvatarFallback>{conv.other_user.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{conv.other_user.full_name}</p>
                  <p className="text-sm text-muted-foreground truncate">{conv.last_message}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat window */}
      <div className="flex-1">
        {selectedConversation ? (
          <Card className="h-full flex flex-col">
            <CardHeader className="py-3"> {/* Reduced padding */}
              <CardTitle className="flex items-center gap-2 text-lg"> {/* Smaller text */}
                {conversations.find(conv => conv.id === selectedConversation)?.other_user && (
                  <>
                    <Avatar>
                      <AvatarImage src={conversations.find(conv => conv.id === selectedConversation)?.other_user.avatar_url || undefined} />
                      <AvatarFallback>{conversations.find(conv => conv.id === selectedConversation)?.other_user.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{conversations.find(conv => conv.id === selectedConversation)?.other_user.full_name}</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden py-2"> {/* Reduced padding */}
              <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                <div className="space-y-3"> {/* Reduced space between messages */}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.user_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-2 rounded-2xl text-sm ${message.user_id === currentUser?.id // Rounder bubbles, smaller text
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="py-2"> {/* Reduced padding */}
              <form onSubmit={sendMessage} className="flex w-full gap-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit" size="sm"> {/* Smaller button */}
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        ) : (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            <p>Select a conversation to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage
