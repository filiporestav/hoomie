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
import Image from "next/image";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  ad_id: string | null; // Include ad_id to fetch the related ad
}

interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[]; // Image paths in Supabase storage
  image_urls: string[]; // Downloaded image URLs
}

const ChatPage = () => {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const supabase = createClient();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to download images from Supabase storage
  const downloadImage = async (path: string) => {
    if (!path) return null;
    try {
      const { data, error } = await supabase.storage
        .from("ad-images")
        .download(path);
      if (error) throw error;
      return URL.createObjectURL(data);
    } catch (error) {
      console.error("Error downloading image:", error);
      return null;
    }
  };

  // Function to download avatars from Supabase storage
  const downloadAvatar = async (path: string | null) => {
    if (!path) return null;
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) throw error;
      return URL.createObjectURL(data);
    } catch (error) {
      console.error("Error downloading avatar:", error);
      return null;
    }
  };

  // Fetch current user details
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
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

  // Fetch conversations and download avatars
  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser) return;

      const { data, error } = await supabase
        .from("conversations")
        .select(
          "id, user1(id, full_name, avatar_url), user2(id, full_name, avatar_url), messages(content, inserted_at), ad_id"
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
              ad_id: conv.ad_id, // Include ad_id
            };
          })
        );
        setConversations(formattedConversations);
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

  // Fetch ad details when conversation is selected
  useEffect(() => {
    const fetchAdDetails = async (ad_id: string) => {
      if (!ad_id) return;

      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("id", ad_id)
        .single();

      if (error) {
        console.error("Error fetching ad:", error);
      } else {
        const imagePaths = data.images || [];

        // Download images from Supabase storage
        const imageUrls = await Promise.all(
          imagePaths.map(async (path: string) => {
            const imageUrl = await downloadImage(path);
            return imageUrl;
          })
        );

        // Filter out any null URLs
        const validImageUrls = imageUrls.filter((url) => url !== null);

        setSelectedAd({
          ...data,
          image_urls: validImageUrls as string[],
        });
      }
    };

    if (selectedConversation) {
      const conversation = conversations.find(
        (conv) => conv.id === selectedConversation
      );
      if (conversation?.ad_id) {
        fetchAdDetails(conversation.ad_id);
      } else {
        setSelectedAd(null);
      }
    }
  }, [selectedConversation, conversations]);

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
      <div className="w-2/4 border-r border-border">
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
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.user_id === currentUser?.id
                          ? "justify-end"
                          : ""
                      }`}
                    >
                      {message.user_id !== currentUser?.id && (
                        <Avatar>
                          <AvatarImage
                            src={message.user.avatar_url || undefined}
                          />
                          <AvatarFallback>
                            {message.user.full_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] p-2 rounded-lg ${
                          message.user_id === currentUser?.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <form onSubmit={sendMessage} className="flex w-full gap-2">
                <Input
                  placeholder="Write a message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button type="submit">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>

      {/* Ad preview section */}
      <div className="w-1/4 border-l border-border">
        <ScrollArea className="h-full">
          {selectedAd ? (
            <div className="p-4">
              {Array.isArray(selectedAd.image_urls) &&
                selectedAd.image_urls.length > 0 && (
                  <Dialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <div className="grid grid-cols-2 gap-2 cursor-pointer">
                        {selectedAd.image_urls.slice(0, 4).map((url, index) => (
                          <div
                            key={index}
                            className="relative aspect-square"
                          >
                            <Image
                              src={url}
                              alt={`Ad Image ${index + 1}`}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-md"
                            />
                          </div>
                        ))}
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <Carousel>
                        <CarouselContent>
                          {selectedAd.image_urls.map((url, index) => (
                            <CarouselItem key={index}>
                              <div className="relative aspect-video">
                                <Image
                                  src={url}
                                  alt={`Ad Image ${index + 1}`}
                                  layout="fill"
                                  objectFit="contain"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    </DialogContent>
                  </Dialog>
                )}
              <h2 className="text-lg font-bold">{selectedAd.title}</h2>
              <p className="text-muted-foreground mb-2">
                {selectedAd.description}
              </p>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <p>Select a conversation to preview the related ad</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default ChatPage;
