import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ManageMenuItemPortions from './ManageMenuItemPortions'
import { useManageMenuItemPortions } from '../../hooks/Menu/useManageMenuItemPortions'

vi.mock('../../hooks/Menu/useManageMenuItemPortions', () => ({
  useManageMenuItemPortions: vi.fn(),
}))

describe('ManageMenuItemPortions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state while portions are fetched', () => {
    vi.mocked(useManageMenuItemPortions).mockReturnValue({
      portions: [],
      selectedPortions: [],
      loading: true,
      saving: false,
      error: null,
      handlePortionToggle: vi.fn(),
      handleSave: vi.fn(),
    } as any)

    render(
      <MemoryRouter>
        <ManageMenuItemPortions
          establishmentCode="est-1"
          menuId={1}
          menuItemId={2}
          productId={3}
          isDish
          productName="Prato"
          onClose={vi.fn()}
          onSuccess={vi.fn()}
        />
      </MemoryRouter>
    )
    expect(screen.getByText('Carregando porções...')).toBeInTheDocument()
  })

  it('triggers save action when clicking save button', () => {
    const handleSave = vi.fn()
    vi.mocked(useManageMenuItemPortions).mockReturnValue({
      portions: [{ id: 7, description: 'Grande' }],
      selectedPortions: [7],
      loading: false,
      saving: false,
      error: null,
      handlePortionToggle: vi.fn(),
      handleSave,
    } as any)

    render(
      <MemoryRouter>
        <ManageMenuItemPortions
          establishmentCode="est-1"
          menuId={1}
          menuItemId={2}
          productId={3}
          isDish
          productName="Prato"
          onClose={vi.fn()}
          onSuccess={vi.fn()}
        />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Salvar Porções' }))
    expect(handleSave).toHaveBeenCalled()
  })
})
