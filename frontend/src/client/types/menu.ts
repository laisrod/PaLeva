export interface MenuCategoriesProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}
