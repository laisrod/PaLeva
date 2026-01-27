import DishCard from './DishCard'
import { DishesListProps } from '../../types/dish'

export default function DishesList({ 
  dishes, 
  establishmentCode, 
  isOwner, 
  onDelete, 
  deleting 
}: DishesListProps) {
  if (dishes.length === 0) {
    return null
  }

  return (
    <div className="dishes-grid">
      {dishes.map(dish => (
        <DishCard
          key={dish.id}
          dish={dish}
          establishmentCode={establishmentCode}
          isOwner={isOwner}
          onDelete={onDelete}
          deleting={deleting}
        />
      ))}
    </div>
  )
}
