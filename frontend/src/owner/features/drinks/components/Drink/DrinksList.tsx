import DrinkCard from './DrinkCard'
import { DrinksListProps } from '../../types/drink'
import '../../../../../css/owner/Drinks.css'

export default function DrinksList({ 
  drinks, 
  establishmentCode, 
  isOwner, 
  onDelete, 
  deleting 
}: DrinksListProps) {
  if (drinks.length === 0) {
    return null
  }

  return (
    <div className="dishes-grid">
      {drinks.map(drink => (
        <DrinkCard
          key={drink.id}
          drink={drink}
          establishmentCode={establishmentCode}
          isOwner={isOwner}
          onDelete={onDelete}
          deleting={deleting}
        />
      ))}
    </div>
  )
}
