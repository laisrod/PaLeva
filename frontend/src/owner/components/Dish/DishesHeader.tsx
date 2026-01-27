import { Link } from 'react-router-dom'
import { DishesHeaderProps } from '../../types/dish'
import '../../../css/owner/Dishes.css'

export default function DishesHeader({ establishmentCode, isOwner }: DishesHeaderProps) {
  return (
    <div className="dishes-header">
      <div className="dishes-header-top">
        <h1 className="dishes-title">Pratos</h1>
        <div className="dishes-actions">
          {isOwner && (
            <Link
              to={`/establishment/${establishmentCode}/dishes/new`}
              className="dishes-btn dishes-btn-primary"
            >
              Novo Prato
            </Link>
          )}
        </div>
      </div>
      
      <div className="dishes-search-container">
        <div className="dishes-search-wrapper">
          <span className="dishes-search-icon"></span>
          <input
            type="text"
            className="dishes-search-input"
            placeholder="Search for food, coffee, etc.."
          />
        </div>
      </div>
    </div>
  )
}
