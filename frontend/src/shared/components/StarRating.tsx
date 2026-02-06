import { useStarRating } from '../hooks/useStarRating'
import '../../css/shared/StarRating.css'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'small' | 'medium' | 'large'
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  showValue?: boolean
  count?: number
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'medium',
  interactive = false,
  onRatingChange,
  showValue = false,
  count
}: StarRatingProps) {
  const {
    displayRating,
    handleClick,
    handleMouseEnter,
    handleMouseLeave
  } = useStarRating({
    rating,
    maxRating,
    interactive,
    onRatingChange
  })

  return (
    <div className={`star-rating star-rating-${size} ${interactive ? 'star-rating-interactive' : ''}`}>
      <div className="stars-container">
        {Array.from({ length: maxRating }, (_, index) => {
          const value = index + 1
          const filled = value <= displayRating
          
          return (
            <span
              key={index}
              className={`star ${filled ? 'star-filled' : 'star-empty'}`}
              onClick={() => handleClick(value)}
              onMouseEnter={() => handleMouseEnter(value)}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: interactive ? 'pointer' : 'default' }}
            >
              ★
            </span>
          )
        })}
      </div>
      {showValue && (
        <span className="rating-value">
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && count > 0 && (
        <span className="rating-count">
          ({count})
        </span>
      )}
    </div>
  )
}
