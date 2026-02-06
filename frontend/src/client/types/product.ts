export interface ProductPortion {
  id: number
  name: string
  price: number
}

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  weight?: string
  pieces?: string
  image?: string
  average_rating?: number
  ratings_count?: number
  portions?: ProductPortion[]
}

export interface ProductCardProps {
  item: Product
  onAddToCart: (item: Product, portion?: ProductPortion) => void
}
