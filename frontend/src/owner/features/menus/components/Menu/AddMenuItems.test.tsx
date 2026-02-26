import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AddMenuItems from './AddMenuItems'
import { useAddMenuItems } from '../../hooks/Menu/useAddMenuItems'

vi.mock('../../hooks/Menu/useAddMenuItems', () => ({
  useAddMenuItems: vi.fn(),
}))

describe('AddMenuItems', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state while fetching menu candidates', () => {
    vi.mocked(useAddMenuItems).mockReturnValue({
      loading: true,
    } as any)

    render(<AddMenuItems establishmentCode="est-1" menuId={10} onItemAdded={vi.fn()} existingItems={[]} />)
    expect(screen.getByText('Carregando itens...')).toBeInTheDocument()
  })

  it('renders dishes tab and calls add handler when item is available', () => {
    // Arrange
    const handleAddItem = vi.fn()
    vi.mocked(useAddMenuItems).mockReturnValue({
      dishes: [{ id: 1, name: 'Feijoada' }],
      drinks: [],
      loading: false,
      activeTab: 'dishes',
      setActiveTab: vi.fn(),
      adding: null,
      error: null,
      handleAddItem,
      isItemInMenu: vi.fn(() => false),
      showPortionModal: false,
      setShowPortionModal: vi.fn(),
      selectedItem: null,
      portions: [],
      loadingPortions: false,
      selectedPortions: [],
      handlePortionToggle: vi.fn(),
      handleConfirmAdd: vi.fn(),
    } as any)

    // Act
    render(<AddMenuItems establishmentCode="est-1" menuId={10} onItemAdded={vi.fn()} existingItems={[]} />)
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }))

    // Assert
    expect(screen.getByText('Feijoada')).toBeInTheDocument()
    expect(handleAddItem).toHaveBeenCalledWith(1, undefined)
  })
})
