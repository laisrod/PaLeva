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
    </div>
  )
}
