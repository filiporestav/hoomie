"use client"

import { useEffect, useRef, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import MessageInput from "./MessageInput"
import { Message, User } from "./types"
import { createClient } from "@/app/utils/supabase/client"
import { DateRange } from "react-day-picker"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

interface ChatWindowProps {
  selectedConversation: string | null
  messages: Message[]
  currentUser: User
  onSendMessage: (content: string) => void
  participants: User[]
}

interface ExchangeProposal {
  id: string
  conversation_id: string
  suggested_by: string
  received_by: string
  exchange_start: string
  exchange_end: string
  status: 'sent' | 'declined' | 'accepted'
  created_at: string
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
  const [proposals, setProposals] = useState<ExchangeProposal[]>([])
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>(undefined)
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const otherUser = participants.find((user) => user.id !== currentUser.id)

  const toUTCDate = (date: Date) => {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  }

  useEffect(() => {
    const fetchProposals = async () => {
      if (!selectedConversation) return

      const { data, error } = await supabase
        .from("exchangeProposal")
        .select("*")
        .eq("conversation_id", selectedConversation)
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Error fetching exchange proposals:", error)
      } else if (data) {
        setProposals(data)
      }
    }

    fetchProposals()

    // Set up real-time listener for new proposals and updates
    const proposalsChannel = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'exchangeProposal' },
        (payload) => {
          setProposals((currentProposals) => [...currentProposals, payload.new as ExchangeProposal])
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'exchangeProposal' },
        (payload) => {
          setProposals((currentProposals) =>
            currentProposals.map((proposal) =>
              proposal.id === payload.new.id ? { ...proposal, ...payload.new } : proposal
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(proposalsChannel)
    }
  }, [selectedConversation, supabase])

  const getProposalFromMessage = (message: Message) => {
    if (!message.content.startsWith("Föreslår byte:")) return null

    const dateStr = message.content.replace("Föreslår byte: ", "")
    return proposals.find(p => {
      const proposalDateStr = `${format(new Date(p.exchange_start), 'yyyy-MM-dd')} - ${format(new Date(p.exchange_end), 'yyyy-MM-dd')}`
      return proposalDateStr === dateStr && p.suggested_by === message.user_id
    })
  }

  const handleExchangeAction = async (action: 'suggest' | 'accept' | 'decline', proposalId?: string) => {
    if (!selectedConversation || (!localDateRange && action === 'suggest')) {
      toast({
        title: "Datum saknas",
        description: "Vänligen välj ett datumintervall innan du föreslår byte.",
        variant: "destructive",
      })
      return
    }

    if (!otherUser) return

    if (action === 'suggest') {
      if (!localDateRange?.from || !localDateRange?.to) return

      const startDate = toUTCDate(localDateRange.from)
      const endDate = toUTCDate(localDateRange.to)

      const { data, error } = await supabase
        .from("exchangeProposal")
        .insert({
          conversation_id: selectedConversation,
          suggested_by: currentUser.id,
          received_by: otherUser.id,
          exchange_start: startDate.toISOString(),
          exchange_end: endDate.toISOString(),
          status: 'sent'
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating exchange proposal:", error)
        toast({
          title: "Fel",
          description: "Det gick inte att skapa bytesförslaget. Försök igen.",
          variant: "destructive",
        })
        return
      }

      setProposals(prev => [...prev, data])
      const messageContent = `Föreslår byte: ${format(localDateRange.from, 'yyyy-MM-dd')} - ${format(localDateRange.to, 'yyyy-MM-dd')}`
      onSendMessage(messageContent)

    } else if ((action === 'accept' || action === 'decline') && proposalId) {
      const newStatus = action === 'accept' ? 'accepted' : 'declined'
      const { error } = await supabase
        .from("exchangeProposal")
        .update({ status: newStatus })
        .eq('id', proposalId)

      if (error) {
        console.error(`Error ${action}ing exchange proposal:`, error)
        toast({
          title: "Fel",
          description: `Det gick inte att ${action === 'accept' ? 'acceptera' : 'avböja'} bytet. Försök igen.`,
          variant: "destructive",
        })
        return
      }

      if (error === null) {
        console.log("Exchange proposal updated successfully")
        const { data } = await supabase
        .from("exchangeProposal")
        .select()
        .eq('id', proposalId)
        .single()

        setProposals(prev => 
          prev.map(p => p.id === proposalId ? data : p)
        )

        if (action === 'accept') {
          const {error: exchangeError } = await supabase
            .from("exchanges")
            .insert({
              user_1: data.suggested_by,
              user_2: data.received_by,
              exchange_start: data.exchange_start,
              exchange_end: data.exchange_end,
            })
          if (exchangeError) {
            console.error("Error creating exchange:", exchangeError)
            toast({
              title: "Fel",
              description: "Det gick inte att registrera bytet. Försök igen.",
              variant: "destructive",
            })
            return
          }
        }

        toast({
          title: "Framgång",
          description: action === 'accept' ? "Byte accepterat!" : "Bytesförfrågan avböjd.",
          variant: "default",
        })
      } else {
        console.error("No data returned from update operation")
        toast({
          title: "Fel",
          description: `Det gick inte att ${action === 'accept' ? 'acceptera' : 'avböja'} bytet. Försök igen.`,
          variant: "destructive",
        })
      }
    }
  }

  const handleSuggestNewDates = async () => {
    if (tempDateRange?.from && tempDateRange?.to) {
      setLocalDateRange(tempDateRange)
      setIsAlertDialogOpen(false)
      await handleExchangeAction('suggest')
    } else {
      toast({
        title: "Fel",
        description: "Vänligen välj ett giltigt datumintervall.",
        variant: "destructive",
      })
    }
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
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline">Föreslå byte</Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  selected={localDateRange}
                  onSelect={setLocalDateRange}
                  numberOfMonths={2}
                />
                <div className="p-2 border-t">
                  <Button onClick={() => {
                    setIsCalendarOpen(false)
                    handleExchangeAction('suggest')
                  }} className="w-full">
                    Föreslå Byte
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden py-2">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-3">
            {messages.map((message) => {
              const proposal = getProposalFromMessage(message)
              return (
                <div
                  key={message.id}
                  className={`flex ${
                    message.user_id === currentUser.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl text-sm relative ${
                      message.user_id === currentUser.id
                        ? "bg-indigo-600 text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    {message.content}
                    {proposal && (
                      <div className="mt-2">
                        {proposal.status === 'sent' && message.user_id !== currentUser.id && (
                          <div className="mt-2 space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleExchangeAction('accept', proposal.id)}
                            >
                              Acceptera
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleExchangeAction('decline', proposal.id)}
                            >
                              Avböj
                            </Button>
                          </div>
                        )}
                        <div className="pb-3">
                        <Badge 
                          variant={
                            proposal.status === 'accepted' ? "default" :
                            proposal.status === 'declined' ? "destructive" :
                            "secondary"
                          }
                          className={`absolute bottom-2 right-2 text-xs ${
                            proposal.status === 'accepted' ? "bg-green-500" :
                            proposal.status === 'sent' ? "bg-blue-500" :
                            ""
                          }`}
                        >
                          {proposal.status === 'accepted' ? 'Accepterat' :
                           proposal.status === 'declined' ? 'Avböjt' :
                           'Förfrågan'}
                        </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
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