import { Link } from 'react-router-dom'
import { DrinksEmptyProps } from '../../types/drink'
import '../../../../../css/owner/Drinks.css'

export default function DrinksEmpty({ establishmentCode, isOwner }: DrinksEmptyProps) {
  return (
    <div className="empty-state">
      <p>Nenhuma bebida cadastrada</p>
      {isOwner && (
        <Link
          to={`/establishment/${establishmentCode}/drinks/new`}
          className="drinks-btn drinks-btn-primary mt-3"
        >
          Criar Primeira Bebida
        </Link>
      )}
    </div>
  )
}
