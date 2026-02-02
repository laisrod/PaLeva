import { DrinksFiltersProps } from '../../types/drink'
import '../../../css/owner/Drinks.css'

export default function DrinksFilters({ tags, selectedTags, onToggleTag, searchTerm, onSearchChange }: DrinksFiltersProps) {
  return (
    <div className="drinks-filters-container">
      <div className="drinks-search-container">
        <input
          type="text"
          placeholder="Buscar bebida por nome..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="drinks-search-input"
        />
      </div>
      {tags.length > 0 && (
        <div className="drinks-categories">
          {tags.map(tag => (
            <button
              key={tag.id}
              className={`drinks-category-tab ${selectedTags.includes(tag.id) ? 'active' : ''}`}
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
