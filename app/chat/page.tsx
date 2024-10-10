import React, { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from 'lucide-react'

export function ChatWindow() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you?', sender: 'bot' },
    { id: 2, text: 'I\'m interested in the beach house.', sender: 'user' },
    // Add more messages as needed
  ])
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: newMessage, sender: 'user' }])
      setNewMessage('')
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={p-2 rounded-lg ${
                message.sender === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'
              } max-w-[80%]}
            >
              {message.text}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}