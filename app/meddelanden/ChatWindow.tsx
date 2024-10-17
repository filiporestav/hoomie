"use client"

import { useEffect, useRef, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format, isEqual } from "date-fns"
import MessageInput from "./MessageInput"
import { Message, User } from "./types"
import { createClient } from "@/app/utils/supabase/client"
import { DateRange } from "react-day-picker"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface ChatWindowProps {
  selectedConversation: string | null
  messages: Message[]
  currentUser: User
  onSendMessage: (content: string) => void
  participants: User[]
}

interface ConversationStatus {
  exchange_suggested_by: string | null
  exchange_accepted_by: string | null
  suggested_date_range: DateRange | undefined
}

export default function ChatWindow({
  selectedConversation,
  messages,
  currentUser,
  onSendMessage,
  participants,
}: ChatWindowProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const { toast } = useToast()
  const [conversationStatus, setConversationStatus] = useState<ConversationStatus>({
    exchange_suggested_by: null,
    exchange_accepted_by: null,
    suggested_date_range: undefined,
  })
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>(undefined)
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const otherUser = participants.find((user) => user.id !== currentUser.id)

  const toUTCDate = (date: Date) => {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    return utcDate
  }

  useEffect(() => {
    const fetchConversationStatus = async () => {
      if (!selectedConversation) return

      const { data, error } = await supabase
        .from("conversations")
        .select("exchange_suggested_by, exchange_accepted_by, suggested_date_start, suggested_date_end")
        .eq("id", selectedConversation)
        .single()

      if (error) {
        console.error("Error fetching conversation status:", error)
      } else {
        const fetchedDateRange = data.suggested_date_start && data.suggested_date_end
          ? { from: new Date(data.suggested_date_start), to: new Date(data.suggested_date_end) }
          : undefined
        setConversationStatus({
          exchange_suggested_by: data.exchange_suggested_by,
          exchange_accepted_by: data.exchange_accepted_by,
          suggested_date_range: fetchedDateRange,
        })
        setLocalDateRange(fetchedDateRange)
      }
    }

    fetchConversationStatus()
  }, [selectedConversation, supabase])

  const areDateRangesEqual = (range1: DateRange | undefined, range2: DateRange | undefined): boolean => {
    if (!range1 || !range2) return range1 === range2
    const fromEqual = (!range1.from && !range2.from) || (!!range1.from && !!range2.from && isEqual(range1.from, range2.from))
    const toEqual = (!range1.to && !range2.to) || (!!range1.to && !!range2.to && isEqual(range1.to, range2.to))
    return fromEqual && toEqual
  }

  const handleExchangeAction = async () => {
    if (!selectedConversation || !localDateRange || !localDateRange.from || !localDateRange.to) {
      toast({
        title: "Datum saknas",
        description: "Vänligen välj ett datumintervall innan du föreslår byte.",
        variant: "destructive",
      })
      return
    }

     // Ensure the dates are in local time without time components
    const startDate = toUTCDate(localDateRange.from)
    
    const endDate = toUTCDate(localDateRange.to)

    const updates: Partial<ConversationStatus> & {
      suggested_date_start: string
      suggested_date_end: string
    } = {
      suggested_date_start: startDate.toISOString(),
      suggested_date_end: endDate.toISOString(),
    }

    if (!conversationStatus.exchange_suggested_by) {
      updates.exchange_suggested_by = currentUser.id
    } else if (conversationStatus.exchange_suggested_by !== currentUser.id) {
      if (!areDateRangesEqual(localDateRange, conversationStatus.suggested_date_range)) {
        updates.exchange_suggested_by = currentUser.id
        updates.exchange_accepted_by = null
      } else {
        updates.exchange_accepted_by = currentUser.id
      }
    }

    const { error } = await supabase
      .from("conversations")
      .update(updates)
      .eq("id", selectedConversation)

    if (error) {
      console.error("Error updating conversation:", error)
      toast({
        title: "Fel",
        description: "Det gick inte att uppdatera konversationen. Försök igen.",
        variant: "destructive",
      })
    } else {
      setConversationStatus((prevStatus) => ({
        ...prevStatus,
        ...updates,
        suggested_date_range: localDateRange,
      }))
      toast({
        title: "Framgång",
        description: updates.exchange_accepted_by ? "Byte bekräftat!" : "Bytesförfrågan har skickats.",
        variant: "default",
      })
    }
  }

  const handleDateSelection = (dateRange: DateRange | undefined) => {
    setLocalDateRange(dateRange)
  }

  const handleCancelRequest = async () => {
    if (!selectedConversation) return

    const updates = {
      exchange_suggested_by: null,
      exchange_accepted_by: null,
      suggested_date_start: null,
      suggested_date_end: null,
    }

    const { error } = await supabase
      .from("conversations")
      .update(updates)
      .eq("id", selectedConversation)

    if (error) {
      console.error("Error canceling request:", error)
      toast({
        title: "Fel",
        description: "Det gick inte att avbryta förfrågan. Försök igen.",
        variant: "destructive",
      })
    } else {
      setConversationStatus({
        exchange_suggested_by: null,
        exchange_accepted_by: null,
        suggested_date_range: undefined,
      })
      setLocalDateRange(undefined)
      toast({
        title: "Framgång",
        description: "Bytesförfrågan har avbrutits.",
        variant: "default",
      })
    }
  }

  const handleSuggestNewDates = async () => {
    if (tempDateRange && tempDateRange.from && tempDateRange.to) {
      const startDate = toUTCDate(tempDateRange.from)

      const endDate = toUTCDate(tempDateRange.to)

      const updates = {
        exchange_suggested_by: currentUser.id,
        exchange_accepted_by: null,
        suggested_date_start: startDate.toISOString(),
        suggested_date_end: endDate.toISOString(),
      }


      const { error } = await supabase
        .from("conversations")
        .update(updates)
        .eq("id", selectedConversation)

      if (error) {
        console.error("Error updating conversation:", error)
        toast({
          title: "Fel",
          description: "Det gick inte att föreslå nya datum. Försök igen.",
          variant: "destructive",
        })
      } else {
        setConversationStatus((prevStatus) => ({
          ...prevStatus,
          ...updates,
          suggested_date_range: tempDateRange,
        }))
        setLocalDateRange(tempDateRange)
        toast({
          title: "Framgång",
          description: "Nya datum har föreslagits.",
          variant: "default",
        })
      }
    }
    setIsAlertDialogOpen(false)
  }

  const getButtonLabel = () => {
    const { exchange_suggested_by, exchange_accepted_by } = conversationStatus
    if (!exchange_suggested_by) {
      return "Föreslå Byte"
    }
    if (exchange_suggested_by === currentUser.id && !exchange_accepted_by) {
      return "Förfrågan Skickad"
    }
    if (exchange_suggested_by !== currentUser.id && !exchange_accepted_by) {
      return "Bekräfta Byte"
    }
    if (exchange_accepted_by) {
      return "Byte Bekräftat!"
    }
    return ""
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      )
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  if (!selectedConversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Välj en konversation
      </div>
    )
  }

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader className="py-3">
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2 text-lg">
            {otherUser && (
              <>
                <Avatar>
                  <AvatarImage src={otherUser.avatar_url || undefined} />
                  <AvatarFallback>
                    {otherUser.full_name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <span>{otherUser.full_name}</span>
              </>
            )}
          </CardTitle>

          <div className="flex items-center gap-2">
            {localDateRange?.from && localDateRange?.to && (
              <Badge variant="secondary" className="text-sm">
                {`${format(localDateRange.from, 'yyyy-MM-dd')} - ${format(localDateRange.to, 'yyyy-MM-dd')}`}
              </Badge>
            )}
            {!conversationStatus.exchange_suggested_by && (
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={localDateRange}
                    onSelect={handleDateSelection}
                    numberOfMonths={2}
                  />
                  <div className="p-2 border-t">
                    <Button onClick={() => setIsCalendarOpen(false)} className="w-full">
                      Välj Datum
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleExchangeAction}
                    disabled={conversationStatus.exchange_accepted_by !== null}
                  >
                    {getButtonLabel()}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Du måste välja datum för att föreslå ett byte</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {conversationStatus.exchange_suggested_by === currentUser.id && !conversationStatus.exchange_accepted_by && (
              <Button variant="destructive" size="icon" onClick={handleCancelRequest}>
                <X className="h-4 w-4" />
              </Button>
            )}
            {conversationStatus.exchange_suggested_by !== currentUser.id && !conversationStatus.exchange_accepted_by && 
            conversationStatus.exchange_suggested_by !== null &&(
              <Button variant="outline" onClick={() => setIsAlertDialogOpen(true)}>
                Ändra Datum
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden py-2">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.user_id === currentUser.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-2 rounded-2xl text-sm ${
                    message.user_id === currentUser.id
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

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Ändra datum för byte</AlertDialogTitle>
            <AlertDialogDescription>
              Välj nya datum för bytet nedan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Calendar
              mode="range"
              selected={tempDateRange}
              onSelect={setTempDateRange}
              numberOfMonths={2}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertDialogOpen(false)}>Avbryt</AlertDialogCancel>
            <AlertDialogAction onClick={handleSuggestNewDates}>Föreslå nya Datum</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  
  )
}