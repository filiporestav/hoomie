'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { createClient } from '@/app/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type ReviewFormData = {
  rating_communication: number
  rating_cleanliness: number
  rating_facilities: number
  rating_area: number
  rating_overall: number
  rating_text: string
}

type UserReviewProps = {
  reviewedBy: string
  reviewedUser: string
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

export default function UserReview({ reviewedBy, reviewedUser, isOpen, onClose, onSubmit }: UserReviewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ReviewFormData>({
    defaultValues: {
      rating_communication: 1,
      rating_cleanliness: 1,
      rating_facilities: 1,
      rating_area: 1,
      rating_overall: 1,
      rating_text: '',
    }
  })
  const supabase = createClient()

  const calculateWeightedAverage = (data: ReviewFormData) => {
    const { rating_communication, rating_cleanliness, rating_facilities, rating_area, rating_overall } = data
    return (rating_communication + rating_cleanliness + rating_facilities + rating_area + rating_overall) / 5
  }

  const updateProfileReviewStats = async (data: ReviewFormData) => {
    const { rating_communication, rating_cleanliness, rating_facilities, rating_area, rating_overall } = data
  
    // Fetch the current stats from profileReviews
    const { data: profileData, error } = await supabase
      .from('profileReviews')
      .select('average_communication, average_cleanliness, average_facilities, average_area, average_overall, average_total_score, number_of_exchanges')
      .eq('user_id', reviewedUser)
      .single()
  
    if (error && error.code !== 'PGRST116') { // PGRST116 indicates "no rows returned"
      console.error('Error fetching profile stats:', error)
      return false
    }
  
    if (!profileData) {
      // No existing profile review data for the user, so we create a new entry
      const newNumberOfExchanges = 1
      const newAverageTotalScore = calculateWeightedAverage(data)
  
      const { error: insertError } = await supabase
        .from('profileReviews')
        .insert({
          user_id: reviewedUser,
          average_total_score: newAverageTotalScore,
          number_of_exchanges: newNumberOfExchanges,
          average_communication: rating_communication,
          average_cleanliness: rating_cleanliness,
          average_facilities: rating_facilities,
          average_area: rating_area,
          average_overall: rating_overall
        })
  
      if (insertError) {
        console.error('Error inserting new profile stats:', insertError)
        return false
      }
  
      return true
    }
  
    // If profileData exists, update the entry
    const { average_communication, average_cleanliness, average_facilities, average_area, average_overall, average_total_score, number_of_exchanges } = profileData
    const newNumberOfExchanges = number_of_exchanges + 1
    const newAverageTotalScore = (average_total_score * number_of_exchanges + calculateWeightedAverage(data)) / newNumberOfExchanges
    const newAverageCommunication = (average_communication * number_of_exchanges + rating_communication) / newNumberOfExchanges
    const newAverageCleanliness = (average_cleanliness * number_of_exchanges + rating_cleanliness) / newNumberOfExchanges
    const newAverageFacilities = (average_facilities * number_of_exchanges + rating_facilities) / newNumberOfExchanges
    const newAverageArea = (average_area * number_of_exchanges + rating_area) / newNumberOfExchanges
    const newAverageOverall = (average_overall * number_of_exchanges + rating_overall) / newNumberOfExchanges
  
    const { error: updateError } = await supabase
      .from('profileReviews')
      .update({
        average_total_score: newAverageTotalScore,
        number_of_exchanges: newNumberOfExchanges,
        average_communication: newAverageCommunication,
        average_cleanliness: newAverageCleanliness,
        average_facilities: newAverageFacilities,
        average_area: newAverageArea,
        average_overall: newAverageOverall
      })
      .eq('user_id', reviewedUser)
  
    if (updateError) {
      console.error('Error updating profile stats:', updateError)
      return false
    }
  
    return true
  }

  const handleFormSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('reviews').insert({
        reviewed_by: reviewedBy,
        reviewed_user: reviewedUser,
        ...data,
      })

      if (error) throw error

      const success = await updateProfileReviewStats(data)
      if (success) {
        onSubmit()
        onClose()
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      // You might want to add an error notification here
    } finally {
      setIsSubmitting(false)
    }
  }

  const ratingFields = [
    { name: 'rating_communication', label: 'Communication' },
    { name: 'rating_cleanliness', label: 'Cleanliness' },
    { name: 'rating_facilities', label: 'Facilities' },
    { name: 'rating_area', label: 'Area' },
    { name: 'rating_overall', label: 'Overall' },
  ] as const

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Rate Your Experience</DialogTitle>
          <Button
            variant="ghost"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {ratingFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium">
                {field.label}
              </label>
              <Slider
                id={field.name}
                min={1}
                max={5}
                step={1}
                value={[watch(field.name)]}
                onValueChange={(value) => setValue(field.name, value[0])}
              />
              <div className="text-sm text-muted-foreground">
                {watch(field.name)} / 5
              </div>
            </div>
          ))}
          <div className="space-y-2">
            <label htmlFor="rating_text" className="text-sm font-medium">
              Review Text
            </label>
            <Textarea
              id="rating_text"
              placeholder="Write your review here (minimum 50 characters)..."
              {...register('rating_text', { 
                required: 'Review text is required', 
                minLength: { 
                  value: 50, 
                  message: 'Review must be at least 50 characters long' 
                } 
              })}
            />
            {errors.rating_text && (
              <p className="text-sm text-red-500">{errors.rating_text.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}