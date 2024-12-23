import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Conversation, Listing } from "./types";
import { CheckCircle } from "lucide-react";

interface ConversationListProps {
  conversations: Conversation[];
  listings: Listing[];
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  listings,
  selectedConversation,
  onSelectConversation,
}) => {
  return (
    <div className="w-1/4 border-r border-border">
      <ScrollArea className="h-full">
        {conversations.map((conv) => {
          const listing = listings.find((l) => l.id === conv.listing_id);
          return (
            <div
              key={conv.id}
              className={`p-4 cursor-pointer hover:bg-accent ${
                selectedConversation === conv.id ? "bg-accent" : ""
              }`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={conv.other_user.avatar_url || undefined} />
                  <AvatarFallback>
                    {conv.other_user.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                <span className="font-medium flex items-center gap-1">
                  {conv.other_user.full_name}
                  {conv.other_user?.verified && (
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                  )}
                </span>

                  
                  <p className="text-sm text-muted-foreground truncate">
                    {conv.last_message}
                  </p>
                  {listing && (
                    <p className="text-xs text-muted-foreground">
                      {listing.title}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
