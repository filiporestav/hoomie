'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/app/utils/supabase/client";
import { Send } from "lucide-react";

interface Message {
  id: string;
  user_id: string;
  content: string;
  inserted_at: string;
}

interface User {
  id: string;
  avatar_url: string;
  username: string;
}

const ChatPage = ({ params }: { params: { conversationId: string } }) => {
  const { conversationId } = params;
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const supabase = createClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: currentUserData } = await supabase
        .from('profiles')
        .select('id, avatar_url, username')
        .eq('id', user.id)
        .single();

      setCurrentUser(currentUserData);

      // Fetch the other user in the conversation
      const { data: conversationData } = await supabase
        .from('conversations')
        .select('user1, user2')
        .eq('id', conversationId)
        .single();

      if (conversationData) {
        const otherUserId = conversationData.user1 === user.id ? conversationData.user2 : conversationData.user1;
        const { data: otherUserData } = await supabase
          .from('profiles')
          .select('id, avatar_url, username')
          .eq('id', otherUserId)
          .single();

        setOtherUser(otherUserData);
      }
    };

    fetchUsers();
  }, [router, supabase, conversationId]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('inserted_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else if (data) {
        setMessages(data);
      }
    };

    if (currentUser) {
      fetchMessages();
      
      const channel = supabase
        .channel(`conversation:${conversationId}`)
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
          }, 
          (payload) => {
            const newMessage = payload.new as Message;
            setMessages(prev => [...prev, newMessage]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [conversationId, currentUser, supabase]);

  useEffect(() => {
    // Scroll to bottom of messages
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        content: newMessage,
        user_id: currentUser.id,
        conversation_id: conversationId
      });

    if (error) console.error('Error sending message:', error);
    else {
      setNewMessage('');
      // Update the last_message timestamp in the conversations table
      await supabase
        .from('conversations')
        .update({ last_message: new Date().toISOString() })
        .eq('id', conversationId);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {otherUser && (
            <>
              <Avatar>
                <AvatarImage src={otherUser.avatar_url} />
                <AvatarFallback>{otherUser.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{otherUser.username}</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4" ref={scrollAreaRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${
                message.user_id === currentUser?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.user_id === currentUser?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={sendMessage} className="flex w-full gap-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatPage;