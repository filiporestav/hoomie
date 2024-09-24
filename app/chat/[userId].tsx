import Chat from "../components/Chat/ChatComponent";

const ChatPage = ({ params }: { params: { userId: string } }) => {
  const { userId } = params;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat with User</h1>
      <Chat userId={userId} />
    </div>
  );
};

export default ChatPage;
