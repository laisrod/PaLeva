import StarRating from '../../../../shared/components/StarRating'
import { ProductCardProps } from '../types/product'
import '../../../../css/client/components/ProductCard.css'

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0Y1RjBFQSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNBMzk4OEMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TZW0gaW1hZ2VtPC90ZXh0Pjwvc3ZnPg=='

export default function ProductCard({ item, onAddToCart, onViewDetail }: ProductCardProps) {
  const imageSrc = item.image && item.image.trim() !== '' ? item.image : placeholderImage
  const displayPrice = item.portions && item.portions.length > 0
    ? item.portions[0].price
    : item.price

  const handleClick = () => {
    if (onViewDetail) onViewDetail(item)
  }

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-image">
        <img
          src={imageSrc}
          alt={item.name}
          onError={e => { (e.target as HTMLImageElement).src = placeholderImage }}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{item.name}</h3>
        {item.description && (
          <p className="product-description">{item.description}</p>
        )}
        {item.average_rating !== undefined && item.average_rating > 0 && (
          <div className="product-rating">
            <StarRating rating={item.average_rating} size="small" showValue={true} count={item.ratings_count} />
          </div>
        )}
        <div className="product-footer">
          <div className="product-price-action">
            <span className="product-price">R$ {displayPrice.toFixed(2)}</span>
            <button
              className="add-to-cart-btn"
              onClick={e => { e.stopPropagation(); onAddToCart(item, item.portions?.[0]) }}
              aria-label="Adicionar ao carrinho"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 16.5C17 17.6 17.9 18.5 19 18.5C20.1 18.5 21 17.6 21 16.5M9 21C9 21.6 8.6 22 8 22C7.4 22 7 21.6 7 21C7 20.4 7.4 20 8 20C8.6 20 9 20.4 9 21ZM20 21C20 21.6 19.6 22 19 22C18.4 22 18 21.6 18 21C18 20.4 18.4 20 19 20C19.6 20 20 20.4 20 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
