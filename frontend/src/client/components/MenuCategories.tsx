import '../../css/client/components/MenuCategories.css'

interface MenuCategoriesProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

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

