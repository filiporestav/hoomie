import React from "react"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

interface HoverMessageButtonProps {
  currentUser: { id: string } | null
  listing?: string
  currentUserAd: boolean
  handleSendMessage: () => void
}

export default function HoverMessageButton({
  currentUser,
  listing,
  currentUserAd,
  handleSendMessage
}: HoverMessageButtonProps) {
  const isDisabled = !currentUser || currentUser.id === listing || !currentUserAd

  const getHoverMessage = () => {
    if (!currentUser) return "Du måste vara inloggad för att skicka ett meddelande."
    if (currentUser.id === listing) return "Du kan inte skicka ett meddelande till din egen annons."
    if (!currentUserAd) return "Du måste ha en aktiv annons för att skicka ett meddelande."
    return "Klicka för att skicka ett meddelande."
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isDisabled) {
      handleSendMessage()
    }
  }

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        <div 
          onClick={handleClick}
          className={`inline-block ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          role="button"
          aria-disabled={isDisabled}
          tabIndex={isDisabled ? -1 : 0}
        >
          <Button
            className={isDisabled ? 'pointer-events-none opacity-50' : ''}
          >
            Skicka meddelande
          </Button>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 p-2">
        <p className="text-sm">{getHoverMessage()}</p>
      </HoverCardContent>
    </HoverCard>
  )
}