"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";

interface Conversation {
  user_id: string;
  user: {
    full_name: string;
    avatar_url: string;
  };
  last_message: string;
  last_message_time: string;
}

const ConversationList = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          user_id,
          user:users (full_name, avatar_url),
          content,
          inserted_at
        `
        )
        .order("inserted_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        // Map the fetched data to match the Conversation interface
        const mappedData = (data || []).map((conv: any) => ({
          user_id: conv.user_id,
          user: {
            full_name: conv.user.full_name,
            avatar_url: conv.user.avatar_url,
          },
          last_message: conv.content,
          last_message_time: conv.inserted_at,
        }));
        setConversations(mappedData);
      }
    };

    fetchConversations();
  }, []);

  const goToChat = (userId: string) => {
    router.push(`/chat/${userId}`); // Assuming chat page is dynamic and accepts userId as a route param
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Conversations</h1>
      {conversations.length === 0 ? (
        <p>No conversations yet.</p>
      ) : (
        <ul className="space-y-4">
          {conversations.map((conv) => (
            <li
              key={conv.user_id}
              className="flex items-center p-4 bg-white shadow rounded-lg cursor-pointer"
              onClick={() => goToChat(conv.user_id)}
            >
              <img
                src={conv.user.avatar_url || "/default-avatar.png"}
                alt={`${conv.user.full_name}'s avatar`}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <div className="font-bold">{conv.user.full_name}</div>
                <div className="text-sm text-gray-500">
                  {conv.last_message.length > 50
                    ? `${conv.last_message.substring(0, 50)}...`
                    : conv.last_message}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(conv.last_message_time).toLocaleString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConversationList;
