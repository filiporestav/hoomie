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
import { Message, Listing } from "./types";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ChatWindowProps {
  selectedConversation: string | null;
  messages: Message[];
  currentUser: any;
  onSendMessage: (content: string) => void;
  listing: Listing | undefined;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedConversation,
  messages,
  currentUser,
  onSendMessage,
  listing,
}) => {
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

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader className="py-3">
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2 text-lg">
            {messages[0] && (
              <>
                <Avatar>
                  <AvatarImage src={messages[0].user.avatar_url || undefined} />
                  <AvatarFallback>
                    {messages[0].user.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{messages[0].user.full_name}</span>
              </>
            )}
          </CardTitle>
          {listing && (
            <div
              className="flex items-start space-x-4 p-2 rounded-lg transition-colors duration-200 ease-in-out cursor-pointer hover:bg-secondary"
              onClick={() => router.push(`/annonser/${listing.id}`)}
            >
              <div className="text-right">
                <h3 className="font-semibold">{listing.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {listing.address}
                </p>
                <Badge variant="outline" className="mt-1">
                  {listing.city}
                </Badge>
              </div>
              <div className="relative w-16 h-16 rounded-md overflow-hidden">
                <Image
                  src={listing.image_urls[0]}
                  alt={listing.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden py-2">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.user_id === currentUser?.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-2 rounded-2xl text-sm ${
                    message.user_id === currentUser?.id
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
};

export default ChatWindow;
