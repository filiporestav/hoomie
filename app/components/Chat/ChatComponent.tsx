'use client';

import { useEffect, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import { User } from "@supabase/supabase-js";

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

interface ChatProps {
  conversationId: string; // Updated to track the conversation by its ID
}

const Chat: React.FC<ChatProps> = ({ conversationId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };

    loadUser();
    fetchMessages();

    // Subscribe to real-time updates in the messages table
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMessage = payload.new as Message;
        // Only add the new message if it's part of the current conversation
        if (newMessage.conversation_id === conversationId) {
          setMessages((currentMessages) => [...currentMessages, newMessage]);
        }
      })
      .subscribe();

    // Cleanup the subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [conversationId, currentUser?.id]);

  // Function to fetch messages from the server
  const fetchMessages = async () => {
    if (!currentUser) return;

    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        user:profiles (name, avatar_url)
      `
      )
      .eq('conversation_id', conversationId) // Fetch messages based on the conversation ID
      .order("inserted_at", { ascending: true });

    if (error) console.error(error);
    else setMessages(data || []);
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (newMessage.trim() && currentUser) {
      const { error } = await supabase
        .from("messages")
        .insert([{ 
          content: newMessage, 
          user_id: currentUser.id, 
          conversation_id: conversationId // Ensure to add the conversation ID when sending the message
        }]);

      if (error) console.error(error);
      setNewMessage(""); // Clear the input field after sending the message
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
