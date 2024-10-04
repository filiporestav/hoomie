"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface Conversation {
  id: number;
  other_user_id: string;
  other_user: {
    username: string;
    avatar_url: string;
  };
  last_message: string;
  last_message_time: string;
}

const ConversationList = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);

  const fetchConversations = async () => {
    if (!currentUser) return;

    const { data, error } = await supabase
      .from("conversations")
      .select(`
        id,
        user1,
        user2,
        last_message,
        user1_profile:profiles!conversations_user1_fkey (id, username, avatar_url),
        user2_profile:profiles!conversations_user2_fkey (id, username, avatar_url)
      `)
      .or(`user1.eq.${currentUser.id},user2.eq.${currentUser.id}`)
      .order('last_message', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      const formattedConversations = (data || []).map((conv: any) => {
        const isUser1 = conv.user1 === currentUser.id;
        const otherUser = isUser1 ? conv.user2_profile : conv.user1_profile;

        return {
          id: conv.id,
          other_user_id: otherUser.id,
          other_user: {
            username: otherUser.username,
            avatar_url: otherUser.avatar_url,
          },
          last_message: conv.last_message,
          last_message_time: conv.last_message,
        };
      });

      setConversations(formattedConversations);
    }
  };

  const goToChat = (conversationId: number) => {
    router.push(`/chat/${conversationId}`);
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Conversations</h1>
      {conversations.length === 0 ? (
        <p>No conversations yet.</p>
      ) : (
        <ul className="space-y-4">
          {conversations.map((conv) => (
            <li
              key={conv.id}
              className="flex items-center p-4 bg-white shadow rounded-lg cursor-pointer"
              onClick={() => goToChat(conv.id)}
            >
              <img
                src={conv.other_user.avatar_url || "/default-avatar.png"}
                alt={`${conv.other_user.username}'s avatar`}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <div className="font-bold">{conv.other_user.username}</div>
                <div className="text-sm text-gray-500">
                  {conv.last_message && conv.last_message.length > 50
                    ? `${conv.last_message.substring(0, 50)}...`
                    : conv.last_message}
                </div>
                <div className="text-xs text-gray-400">
                  {conv.last_message_time && new Date(conv.last_message_time).toLocaleString()}
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
