import { useState } from 'react'

interface UseStarRatingProps {
  rating: number
  maxRating?: number
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}

export function useStarRating({
  rating,
  maxRating = 5,
  interactive = false,
  onRatingChange
}: UseStarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value)
    }
  }

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoveredRating(value)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoveredRating(0)
    }
  }

  const displayRating = hoveredRating || rating

  return {
    displayRating,
    handleClick,
    handleMouseEnter,
    handleMouseLeave
  }
}
