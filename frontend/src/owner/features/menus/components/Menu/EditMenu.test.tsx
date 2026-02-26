import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import EditMenu from './EditMenu'
import { useEditMenuPage } from '../../hooks/Menu/useEditMenuPage'
import { useEditMenuItems } from '../../hooks/Menu/useEditMenuItems'

vi.mock('../../hooks/Menu/useEditMenuPage', () => ({
  useEditMenuPage: vi.fn(),
}))

vi.mock('../../hooks/Menu/useEditMenuItems', () => ({
  useEditMenuItems: vi.fn(),
}))

vi.mock('./AddMenuItems', () => ({
  default: () => <div>AddMenuItems Mock</div>,
}))

vi.mock('./ManageMenuItemPortions', () => ({
  default: () => <div>ManageMenuItemPortions Mock</div>,
}))

vi.mock('./EditMenuLoading', () => ({
  default: () => <div>EditMenuLoading Mock</div>,
}))

vi.mock('../../../../shared/components/Layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('EditMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading component when menu is loading', () => {
    vi.mocked(useEditMenuPage).mockReturnValue({
      loadingMenu: true,
    } as any)
    vi.mocked(useEditMenuItems).mockReturnValue({} as any)

    render(
      <MemoryRouter>
        <EditMenu />
      </MemoryRouter>
    )
    expect(screen.getByText('EditMenuLoading Mock')).toBeInTheDocument()
  })

  it('renders menu form and removes menu item on click', () => {
    // Arrange
    const handleRemoveItem = vi.fn()
    vi.mocked(useEditMenuPage).mockReturnValue({
      establishmentCode: 'est-1',
      menuId: '10',
      formData: { name: 'Executivo', description: 'Do dia', price: '20.00' },
      errors: [],
      loading: false,
      loadingMenu: false,
      handleChange: vi.fn(),
      handleSubmit: vi.fn((e: any) => e.preventDefault()),
    } as any)
    vi.mocked(useEditMenuItems).mockReturnValue({
      menuItems: [{ id: 1, dish: { id: 2, name: 'Prato', portions: [] } }],
      loadingItems: false,
      refetchItems: vi.fn(),
      removingItem: false,
      managingPortions: null,
      handleRemoveItem,
      handleManagePortions: vi.fn(),
      handleCloseManagePortions: vi.fn(),
    } as any)

    // Act
    render(
      <MemoryRouter>
        <EditMenu />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Remover do Cardápio' }))

    // Assert
    expect(screen.getByDisplayValue('Executivo')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Do dia')).toBeInTheDocument()
    expect(handleRemoveItem).toHaveBeenCalledWith(1)
  })
})
