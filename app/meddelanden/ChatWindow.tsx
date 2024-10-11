import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import MessageInput from "./MessageInput";
import { Message, Listing, User } from "./types";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ChatWindowProps {
  selectedConversation: string | null;
  messages: Message[];
  currentUser: User;
  onSendMessage: (content: string) => void;
  participants: User[];
}

export default function ChatWindow({
  selectedConversation,
  messages,
  currentUser,
  onSendMessage,
  participants,
}: ChatWindowProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  if (!selectedConversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Välj en konversation
      </div>
    );
  }

  const otherUser = participants.find(user => user.id !== currentUser.id);

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader className="py-3">
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2 text-lg">
            {otherUser && (
              <>
                <Avatar>
                  <AvatarImage src={otherUser.avatar_url} />
                  <AvatarFallback>
                    {otherUser.full_name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <span>{otherUser.full_name}</span>
              </>
            )}
          </CardTitle>
         
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden py-2">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.user_id === currentUser.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-2 rounded-2xl text-sm ${
                    message.user_id === currentUser.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t border-border p-3">
        <MessageInput onSendMessage={onSendMessage} />
      </CardFooter>
    </Card>
  );
}