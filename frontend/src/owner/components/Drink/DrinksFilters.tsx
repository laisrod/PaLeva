import { DrinksFiltersProps } from '../../types/drink'
import '../../../css/owner/Drinks.css'

export default function DrinksFilters({ tags, selectedTags, onToggleTag }: DrinksFiltersProps) {
  if (tags.length === 0) {
    return null
  }

  return (
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
  )
}
