"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

interface Message {
  id: number;
  content: string;
  inserted_at: string;
  user_id: string;
  user: {
    full_name: string;
    avatar_url: string | null;
  };
}

interface ChatProps {
  userId: string; // The ID of the user you're chatting with
}

const Chat: React.FC<ChatProps> = ({ userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const supabase = createClient();

  useEffect(() => {
    // Fetch messages between the logged-in user and the other user
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          user:profiles (name, avatar_url)
        `
        )
        .eq("user_id", userId) // Only fetch messages with this user
        .order("inserted_at", { ascending: true });

      if (error) console.error(error);
      else setMessages(data || []);
    };

    fetchMessages();
  }, [userId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const { error } = await supabase
        .from("messages")
        .insert([{ content: newMessage, user_id: userId }]); // Insert new message for this conversation
      if (error) console.error(error);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-100 rounded-lg">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className="p-2 bg-white mb-2 rounded shadow">
            {msg.content}
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
