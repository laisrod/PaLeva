import { MenuCategoriesProps } from '../types/menu'
import '../../css/client/components/MenuCategories.css'

export default function MenuCategories({
  categories,
  selectedCategory,
  onSelectCategory
}: MenuCategoriesProps) {
  return (
    <div className="menu-categories">
      {categories.map(category => (
        <button
          key={category}
          className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

