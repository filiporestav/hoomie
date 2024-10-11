"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";
import ChatWindow from "./ChatWindow";
import ConversationList from "./ConversationList";
import { Conversation, Message, User } from "./types";
import { useSearchParams } from "next/navigation";
import UserAd from './UserAd';

const ChatPage = () => {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const supabase = createClient();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");
  const searchParams = useSearchParams();

  // Function to download avatars from Supabase storage
  const downloadAvatar = async (path: string | null) => {
    if (!path) return null; // If there's no avatar URL, return null
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      return URL.createObjectURL(data); // Convert the file to a usable URL
    } catch (error) {
      console.error("Error downloading avatar:", error);
      return null;
    }
  };

    const getParticipants = (conversationId: string): User[] => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation || !currentUser) return [];
    return [currentUser, conversation.other_user];
  };
  // Fetch current user details
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/logga-in");
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

  // Set the selected conversation from query param
  useEffect(() => {
    const conversationId = searchParams.get("conversationId");
    if (conversationId) {
      setSelectedConversation(conversationId);
    }
  }, [searchParams]);


  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase.from("ads").select("*");
      if (error) {
        console.error("Error fetching listings:", error);
      } else {
        console.log(data, "data");
        setListings(data);
      }
    };

    fetchListings();
  }, [supabase]);

  // Fetch conversations and download avatars
  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser) return;

      const { data, error } = await supabase
        .from("conversations")
        .select(
          "id, user1(id, full_name, avatar_url), user2(id, full_name, avatar_url), messages(content, inserted_at), ad_id" // ad_id added here
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
            const avatarUrl = await downloadAvatar(otherUser.avatar_url); // Download avatar

            return {
              id: conv.id,
              other_user: { ...otherUser, avatar_url: avatarUrl }, // Set the downloaded avatar URL
              last_message: conv.messages[0]?.content || "",
              inserted_at: conv.messages[0]?.inserted_at || "",
              listing_id: conv.ad_id || null, // Use ad_id instead of listing_id
            };
          })
        );
        setConversations(formattedConversations);
        // console.log(formattedConversations, "formatted conversations");
      }
    };

    fetchConversations();
  }, [currentUser, supabase]);

  // Fetch messages for the selected conversation and download avatars
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

  // Scroll to bottom of messages on new message
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

  const sendMessage = async (content: string) => {
    if (!content.trim() || !currentUser || !selectedConversation) return;

    const { error } = await supabase.from("messages").insert({
      content,
      user_id: currentUser.id,
      conversation_id: selectedConversation,
    });

    if (error) console.error("Error sending message:", error);
    else {
      setNewMessage("");
    }
  };

  return (
    <div className="flex bg-background h-[75vh] overflow-hidden">
      <ConversationList
        conversations={conversations}
        listings={listings}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
      />
      <div className="flex-grow flex overflow-hidden border-l border-border">
        <ChatWindow
          selectedConversation={selectedConversation}
          messages={messages}
          currentUser={currentUser}
          onSendMessage={sendMessage}
          listing={listings.find(
            (l) =>
              l.id ===
              conversations.find((c) => c.id === selectedConversation)?.listing_id
          )}
          participants={selectedConversation ? getParticipants(selectedConversation) : []}
        />
        {selectedConversation && (
          <div className="w-1/3 border-l border-border overflow-hidden">
            <UserAd userId={getParticipants(selectedConversation).find(user => user.id !== currentUser?.id)?.id || ''} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;