import { DishesFiltersProps } from '../../types/dish'
import '../../../css/owner/Dishes.css'

export default function DishesFilters({ tags, selectedTags, onToggleTag }: DishesFiltersProps) {
  if (tags.length === 0) {
    return null
  }

  return (
    <div className="filters-card">
      <h3 className="filters-title">Filtrar por Características</h3>
      <div className="filter-tags">
        {tags.map(tag => (
          <div key={tag.id} className="filter-tag">
            <input
              type="checkbox"
              id={`tag_${tag.id}`}
              checked={selectedTags.includes(tag.id)}
              onChange={() => onToggleTag(tag.id)}
            />
            <label htmlFor={`tag_${tag.id}`}>
              {tag.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
