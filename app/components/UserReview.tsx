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

  const updateProfileStats = async (newReviewScore: number) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('average_review_score, number_of_exchanges')
      .eq('id', reviewedUser)
      .single()
    console.log(data, 'data fetched from updateProfileStats')
    if (error) {
      console.error('Error fetching profile stats:', error)
      return
    }

    const { average_review_score, number_of_exchanges } = data
    const newNumberOfExchanges = number_of_exchanges + 1
    const newAverageScore = (average_review_score * number_of_exchanges + newReviewScore) / newNumberOfExchanges

    const {  data: updatedData, error: updateError } = await supabase
      .from('profiles')
      .update({
        average_review_score: newAverageScore,
        number_of_exchanges: newNumberOfExchanges
      })
      .eq('id', reviewedUser)
    console.log(reviewedUser, 'reviewedUser')
    console.log(updatedData, 'updatedData')

    if (updateError) {
      console.error('Error updating profile stats:', updateError)
    }
    else {
      return true
    }
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

      const weightedAverage = calculateWeightedAverage(data)
      let success = await updateProfileStats(weightedAverage)
      console.log('success', success)

      onSubmit()
      onClose()
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