import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MenuItemsList from './MenuItemsList'
import { useMenuItemsList } from '../../hooks/Menu/useMenuItemsList'

vi.mock('../../hooks/Menu/useMenuItemsList', () => ({
  useMenuItemsList: vi.fn(),
}))

describe('MenuItemsList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty state when menu has no items', () => {
    vi.mocked(useMenuItemsList).mockReturnValue({
      selectedMenuItem: null,
      selectedPortion: null,
      quantity: 1,
      handleItemClick: vi.fn(),
      handlePortionClick: vi.fn(),
      handleAddToOrder: vi.fn(),
      handleQuantityChange: vi.fn(),
    } as any)

    render(<MenuItemsList menuItems={[]} loading={false} onSelectItem={vi.fn()} />)
    expect(screen.getByText('Nenhum item no cardápio')).toBeInTheDocument()
  })

  it('renders menu item and calls item click handler', () => {
    // Arrange
    const handleItemClick = vi.fn()
    vi.mocked(useMenuItemsList).mockReturnValue({
      selectedMenuItem: null,
      selectedPortion: null,
      quantity: 1,
      handleItemClick,
      handlePortionClick: vi.fn(),
      handleAddToOrder: vi.fn(),
      handleQuantityChange: vi.fn(),
    } as any)

    // Act
    render(
      <MenuItemsList
        loading={false}
        onSelectItem={vi.fn()}
        menuItems={[{ id: 1, dish: { name: 'Prato do dia', portions: [] } } as any]}
      />
    )
    fireEvent.click(screen.getByText('Prato do dia'))

    // Assert
    expect(handleItemClick).toHaveBeenCalledWith(1)
  })
})
