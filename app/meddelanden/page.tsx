"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/app/utils/supabase/client";
import { Send } from "lucide-react";
import { Ad } from '@/app/types'; // Adjust the import based on your project structure
import { PreviewAd } from "./PreviewAd"; // Ensure the correct path

interface Message {
  id: number;
  content: string;
  inserted_at: string;
  user_id: string;
  conversation_id: string;
  user: {
    full_name: string;
    avatar_url: string | null;
  };
}

interface Conversation {
  id: string;
  other_user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  last_message: string;
  inserted_at: string;
}

const ChatPage = () => {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [adData, setAdData] = useState<Ad | null>(null); // State to hold ad data
  const supabase = createClient();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const downloadAvatar = async (path: string | null) => {
    if (!path) return null;
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      return URL.createObjectURL(data);
    } catch (error) {
      console.error("Error downloading avatar:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: currentUserData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching current user:", error);
      } else {
        setCurrentUser(currentUserData);
      }
    };

    fetchCurrentUser();
  }, [router, supabase]);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser) return;

      const { data, error } = await supabase
        .from("conversations")
        .select(
          "id, user1(id, full_name, avatar_url), user2(id, full_name, avatar_url), messages(content, inserted_at)"
        )
        .or(`user1.eq.${currentUser.id},user2.eq.${currentUser.id}`)
        .order("inserted_at", { foreignTable: "messages", ascending: false });

      if (error) {
        console.error("Error fetching conversations:", error);
      } else if (data) {
        const formattedConversations = await Promise.all(
          data.map(async (conv: any) => {
            const otherUser =
              conv.user1.id === currentUser.id ? conv.user2 : conv.user1;
            const avatarUrl = await downloadAvatar(otherUser.avatar_url);

            return {
              id: conv.id,
              other_user: { ...otherUser, avatar_url: avatarUrl },
              last_message: conv.messages[0]?.content || "",
              inserted_at: conv.messages[0]?.inserted_at || "",
            };
          })
        );
        setConversations(formattedConversations);
      }
    };

    fetchConversations();
  }, [currentUser, supabase]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedConversation) return;

      const { data, error } = await supabase
        .from("messages")
        .select("*, user:profiles(full_name, avatar_url)")
        .eq("conversation_id", selectedConversation)
        .order("inserted_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else if (data) {
        const formattedMessages = await Promise.all(
          data.map(async (message: any) => {
            const avatarUrl = await downloadAvatar(message.user.avatar_url);
            return {
              ...message,
              user: {
                ...message.user,
                avatar_url: avatarUrl,
              },
            };
          })
        );
        setMessages(formattedMessages);
      }
    };

    fetchMessages();

    const fetchAdData = async () => {
      if (!selectedConversation) return;
      const { data: ad, error } = await supabase
        .from("ads") // Adjust this to your actual ads table name
        .select("*")
        .eq("conversation_id", selectedConversation)
        .single();

      if (error) {
        console.error("Error fetching ad data:", error);
      } else {
        console.log('Fetched ad data:', ad); // Log fetched ad data
        setAdData(ad);
      }
    };

    fetchAdData();

    const channel = supabase
      .channel(`conversation:${selectedConversation}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation, supabase]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !selectedConversation) return;

    const { error } = await supabase.from("messages").insert({
      content: newMessage,
      user_id: currentUser.id,
      conversation_id: selectedConversation,
    });

    if (error) console.error("Error sending message:", error);
    else {
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-[80vh] bg-background">
      {/* Sidebar for conversations */}
      <div className="w-1/4 border-r border-border">
        <ScrollArea className="h-full">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-4 cursor-pointer hover:bg-accent ${
                selectedConversation === conv.id ? "bg-accent" : ""
              }`}
              onClick={() => setSelectedConversation(conv.id)}
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={conv.other_user.avatar_url || undefined} />
                  <AvatarFallback>
                    {conv.other_user.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{conv.other_user.full_name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.last_message}
                  </p>
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
            <CardHeader className="py-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {conversations.find((conv) => conv.id === selectedConversation)
                  ?.other_user && (
                  <>
                    <Avatar>
                      <AvatarImage
                        src={
                          conversations.find(
                            (conv) => conv.id === selectedConversation
                          )?.other_user.avatar_url || undefined
                        }
                      />
                      <AvatarFallback>
                        {conversations
                          .find((conv) => conv.id === selectedConversation)
                          ?.other_user.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {
                        conversations.find(
                          (conv) => conv.id === selectedConversation
                        )?.other_user.full_name
                      }
                    </span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden py-2">
              <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                {messages.map((message) => (
                  <div key={message.id} className="py-2">
                    <p className="font-semibold">{message.user.full_name}</p>
                    <p className="text-sm text-muted-foreground">{message.content}</p>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex items-center">
              <form onSubmit={sendMessage} className="w-full flex">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="mr-2"
                />
                <Button type="submit">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        ) : (
          <Card className="h-full">
            <CardContent className="flex items-center justify-center h-full">
              <p>Select a conversation to start chatting</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Ad preview area */}
      <div className="w-1/4 border-l border-border">
        <PreviewAd ad={adData} /> {/* Display the ad data here */}
      </div>
    </div>
  );
};

export default ChatPage;
