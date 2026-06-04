import { useState } from 'react'
import StarRating from '../../../../shared/components/StarRating'
import { Product, ProductPortion } from '../types/product'
import '../../../../css/client/components/ProductDetail.css'

interface ProductDetailProps {
  item: Product
  onClose: () => void
  onAddToCart: (item: Product, portion?: ProductPortion, quantity?: number) => void
}

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0Y1RjBFQSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNBMzk4OEMiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TZW0gaW1hZ2VtPC90ZXh0Pjwvc3ZnPg=='

export default function ProductDetail({ item, onClose, onAddToCart }: ProductDetailProps) {
  const [selectedPortion, setSelectedPortion] = useState<ProductPortion | null>(
    item.portions && item.portions.length > 0 ? item.portions[0] : null
  )
  const [quantity, setQuantity] = useState(1)
  const [expanded, setExpanded] = useState(false)
  const [favorited, setFavorited] = useState(false)
  const [imgSrc, setImgSrc] = useState(
    item.image && item.image.trim() !== '' ? item.image : placeholderImage
  )

  const displayPrice = selectedPortion ? selectedPortion.price : item.price
  const totalPrice = displayPrice * quantity

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(item, selectedPortion ?? undefined)
    }
    onClose()
  }

  const description = item.description || ''
  const isLong = description.length > 100
  const visibleDescription = expanded || !isLong ? description : description.slice(0, 100) + '...'

  return (
    <div className="pd-overlay" onClick={onClose}>
      <div className="pd-sheet" onClick={e => e.stopPropagation()}>

        {/* Hero image */}
        <div className="pd-hero">
          <div className="pd-hero-bg" style={{ backgroundImage: `url(${imgSrc})` }} />
          <button className="pd-back" onClick={onClose} aria-label="Voltar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <img
            className="pd-hero-img"
            src={imgSrc}
            alt={item.name}
            onError={() => setImgSrc(placeholderImage)}
          />
        </div>

        {/* Content card */}
        <div className="pd-content">

          {/* Title row */}
          <div className="pd-title-row">
            <h2 className="pd-title">{item.name}</h2>
            <button
              className={`pd-fav ${favorited ? 'pd-fav--active' : ''}`}
              onClick={() => setFavorited(f => !f)}
              aria-label="Favoritar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={favorited ? 'currentColor' : 'none'}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Description */}
          {description && (
            <p className="pd-description">
              {visibleDescription}
              {isLong && (
                <button className="pd-read-more" onClick={() => setExpanded(e => !e)}>
                  {expanded ? ' Menos' : ' Leia mais...'}
                </button>
              )}
            </p>
          )}

          {/* Info row */}
          <div className="pd-info-row">
            {item.average_rating !== undefined && item.average_rating > 0 && (
              <div className="pd-info-item">
                <StarRating rating={item.average_rating} size="small" showValue={true} count={item.ratings_count} />
              </div>
            )}
            {(item as any).calories && (
              <div className="pd-info-item">
                <span className="pd-info-icon">🔥</span>
                <span>{(item as any).calories} kcal</span>
              </div>
            )}
          </div>

          {/* Portion selector */}
          {item.portions && item.portions.length > 0 && (
            <div className="pd-portions">
              <span className="pd-portions-label">Tamanho</span>
              <div className="pd-portions-list">
                {item.portions.map(portion => (
                  <button
                    key={portion.id}
                    className={`pd-portion-btn ${selectedPortion?.id === portion.id ? 'pd-portion-btn--active' : ''}`}
                    onClick={() => setSelectedPortion(portion)}
                  >
                    {portion.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price + quantity + CTA */}
          <div className="pd-footer">
            <div className="pd-price-qty">
              <span className="pd-price">R$ {totalPrice.toFixed(2)}</span>
              <div className="pd-qty">
                <button
                  className="pd-qty-btn"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  aria-label="Diminuir"
                >−</button>
                <span className="pd-qty-value">{quantity}</span>
                <button
                  className="pd-qty-btn"
                  onClick={() => setQuantity(q => q + 1)}
                  aria-label="Aumentar"
                >+</button>
              </div>
            </div>
            <button className="pd-add-btn" onClick={handleAddToCart}>
              Adicionar ao Carrinho
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
