import { DishesFiltersProps } from '../../types/dish'
import '../../../../../css/owner/Dishes.css'

export default function DishesFilters({ tags, selectedTags, onToggleTag, searchTerm, onSearchChange }: DishesFiltersProps) {
  return (
    <div className="dishes-filters-container">
      <div className="dishes-search-container">
        <input
          type="text"
          placeholder="Buscar prato por nome..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="dishes-search-input"
        />
      </div>
      {tags.length > 0 && (
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
      )}
    </div>
  )
}
