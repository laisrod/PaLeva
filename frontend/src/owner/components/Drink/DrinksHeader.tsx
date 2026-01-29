import { Link } from 'react-router-dom'
import { DrinksHeaderProps } from '../../types/drink'
import '../../../css/owner/Drinks.css'

export default function DrinksHeader({ establishmentCode, isOwner }: DrinksHeaderProps) {
  return (
    <div className="drinks-header">
      <div className="drinks-header-top">
        <h1 className="drinks-title">Bebidas</h1>
        <div className="drinks-actions">
          {isOwner && (
            <Link
              to={`/establishment/${establishmentCode}/drinks/new`}
              className="drinks-btn drinks-btn-primary"
            >
              Novo Bebida
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
