import { DishesFiltersProps } from '../../types/dish'
import '../../../css/owner/Dishes.css'

export default function DishesFilters({ tags, selectedTags, onToggleTag }: DishesFiltersProps) {
  if (tags.length === 0) {
    return null
  }

  return (
    <div className="dishes-categories">
      {tags.map(tag => (
        <button
          key={tag.id}
          className={`dishes-category-tab ${selectedTags.includes(tag.id) ? 'active' : ''}`}
          onClick={() => onToggleTag(tag.id)}
        >
          {tag.name}
        </button>
      ))}
    </div>
  )
}
