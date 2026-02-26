import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCreateDrinkPortion } from './useCreateDrinkPortion'
import { ownerApi } from '../../../../shared/services/api'

const navigateMock = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('../../../../shared/services/api', () => ({
  ownerApi: {
    createDrinkPortion: vi.fn(),
  },
}))

vi.mock('../../../../shared/hooks/errorHandler', () => ({
  getErrorMessage: vi.fn((response: any) => response?.error || ''),
}))

describe('useCreateDrinkPortion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('validates required fields and price format before submit', async () => {
    // Arrange
    const { result } = renderHook(() =>
      useCreateDrinkPortion({ establishmentCode: 'est-1', drinkId: 10 })
    )

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    // Assert
    expect(result.current.errors).toContain('Descrição é obrigatória')
    expect(result.current.errors).toContain('Preço é obrigatório')
    expect(ownerApi.createDrinkPortion).not.toHaveBeenCalled()
  })

  it('submits parsed portion payload and navigates on success', async () => {
    // Arrange
    const onSuccess = vi.fn()
    vi.mocked(ownerApi.createDrinkPortion).mockResolvedValue({ data: { portion: { id: 1 } } } as any)
    const { result } = renderHook(() =>
      useCreateDrinkPortion({ establishmentCode: 'est-1', drinkId: 10, onSuccess })
    )
    act(() => {
      result.current.handleChange({ target: { name: 'description', value: '  Grande  ' } } as any)
      result.current.handleChange({ target: { name: 'price', value: '19.9' } } as any)
    })

    // Act
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as any)
    })

    // Assert
    expect(ownerApi.createDrinkPortion).toHaveBeenCalledWith('est-1', 10, {
      description: 'Grande',
      price: 19.9,
    })
    expect(onSuccess).toHaveBeenCalled()
    expect(navigateMock).toHaveBeenCalledWith('/establishment/est-1/drinks/10/portions')
  })
})
