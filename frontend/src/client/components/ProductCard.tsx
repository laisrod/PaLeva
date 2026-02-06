import StarRating from '../../shared/components/StarRating'
import { ProductCardProps } from '../types/product'
import { useProductCard } from '../hooks/useProductCard'
import '../../css/client/components/ProductCard.css'

export default function ProductCard({ item, onAddToCart }: ProductCardProps) {
  const {
    selectedPortion,
    displayPrice,
    handlePortionChange,
    handleAddToCart
  } = useProductCard({ item, onAddToCart })

  return (
    <div className="product-card">
      <div className="product-image">
        <img
          src={item.image || 'https://via.placeholder.com/200x150?text=Product'}
          alt={item.name}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{item.name}</h3>
        {item.description && (
          <p className="product-description">{item.description}</p>
        )}
        {(item.average_rating !== undefined && item.average_rating > 0) && (
          <div className="product-rating">
            <StarRating
              rating={item.average_rating}
              size="small"
              showValue={true}
              count={item.ratings_count}
            />
          </div>
        )}
        
        {item.portions && item.portions.length > 0 && (
          <div className="portion-selector">
            <select
              value={selectedPortion?.id || ''}
              onChange={(e) => handlePortionChange(parseInt(e.target.value))}
              className="portion-select"
            >
              {item.portions.map(portion => (
                <option key={portion.id} value={portion.id}>
                  {portion.name} - €{portion.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="product-footer">
          <div className="product-details">
            {item.weight && <span className="product-weight">{item.weight}</span>}
            {item.pieces && <span className="product-pieces">{item.pieces}</span>}
          </div>
          <div className="product-price-action">
            <span className="product-price">€{displayPrice.toFixed(2)}</span>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1046 17.8954 19 19 19C20.1046 19 21 18.1046 21 17V13M9 19.5C9.82843 19.5 10.5 20.1716 10.5 21C10.5 21.8284 9.82843 22.5 9 22.5C8.17157 22.5 7.5 21.8284 7.5 21C7.5 20.1716 8.17157 19.5 9 19.5ZM20 19.5C20.8284 19.5 21.5 20.1716 21.5 21C21.5 21.8284 20.8284 22.5 20 22.5C19.1716 22.5 18.5 21.8284 18.5 21C18.5 20.1716 19.1716 19.5 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

