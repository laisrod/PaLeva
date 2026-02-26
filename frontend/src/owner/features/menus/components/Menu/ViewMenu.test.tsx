import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ViewMenu from './ViewMenu'
import { useViewMenu } from '../../hooks/Menu/useViewMenu'

vi.mock('../../hooks/Menu/useViewMenu', () => ({
  useViewMenu: vi.fn(),
}))

vi.mock('../../../../shared/components/Layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('./ViewMenuLoading', () => ({
  default: () => <div>Loading view menu</div>,
}))

describe('ViewMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading component while page is loading', () => {
    vi.mocked(useViewMenu).mockReturnValue({
      loading: true,
    } as any)

    render(
      <MemoryRouter>
        <ViewMenu />
      </MemoryRouter>
    )
    expect(screen.getByText('Loading view menu')).toBeInTheDocument()
  })

  it('renders menu details and removes item on button click', () => {
    // Arrange
    const handleRemoveItem = vi.fn()
    vi.mocked(useViewMenu).mockReturnValue({
      establishmentCode: 'est-1',
      menuId: '9',
      menuData: { id: 9, name: 'Executivo', description: 'Do dia', price: 25 },
      loading: false,
      error: null,
      menuItems: [{ id: 1, dish: { name: 'Prato', portions: [] } }],
      loadingItems: false,
      removingItem: false,
      handleRemoveItem,
    } as any)

    // Act
    render(
      <MemoryRouter>
        <ViewMenu />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Remover do Cardápio' }))

    // Assert
    expect(screen.getByText('Executivo')).toBeInTheDocument()
    expect(screen.getByText('Preço: R$ 25.00')).toBeInTheDocument()
    expect(handleRemoveItem).toHaveBeenCalledWith(1)
  })
})
