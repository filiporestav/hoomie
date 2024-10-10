"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/app/utils/supabase/client";
import { Send } from "lucide-react";

interface UserProfile {
  id: string;
}

interface ChatWindowProps {
  selectedConversation: string | null;
  currentUser: UserProfile | null;
}

const ChatWindow = ({ selectedConversation, currentUser }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState("");
  const supabase = createClient();

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
      setNewMessage(""); // Clear the input after sending the message
    }
  };

  return (
    <div className="flex h-full">
      <form
        onSubmit={sendMessage}
        className="flex w-full items-center space-x-2 p-3 border-t border-border"
      >
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <Button type="submit">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;
