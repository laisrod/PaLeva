import { Link } from 'react-router-dom'
import { DishesEmptyProps } from '../../types/dish'
import '../../../../../css/owner/Dishes.css'

export default function DishesEmpty({ establishmentCode, isOwner }: DishesEmptyProps) {
  return (
    <div className="empty-state">
      <p>Nenhum prato cadastrado</p>
      {isOwner && (
        <Link
          to={`/establishment/${establishmentCode}/dishes/new`}
          className="dishes-btn dishes-btn-primary mt-3"
        >
          Criar Primeiro Prato
        </Link>
      )}
    </div>
  )
}
