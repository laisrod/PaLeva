import { useParams } from 'react-router-dom'
import { useRequireOwner } from '../../../shared/hooks/useRequireOwner'
import { useAuth } from '../../../shared/hooks/useAuth'
import { useEstablishment } from '../Establishment/useEstablishment'

export type DashboardState = 'loading' | 'error' | 'success'

export interface UseDashboardReturn {
  state: DashboardState
  establishment: ReturnType<typeof useEstablishment>['establishment']
  isOwner: boolean
  errorMessage: string | null
}

export function useDashboard(): UseDashboardReturn {
  const { code } = useParams<{ code: string }>()
  useRequireOwner() // Verifica se é owner e redireciona se não for
  const { isOwner } = useAuth()
  const { establishment, loading, error } = useEstablishment(code)

  if (loading) {
    return {
      state: 'loading',
      establishment: null,
      isOwner,
      errorMessage: null
    }
  }

  if (error || !establishment) {
    return {
      state: 'error',
      establishment: null,
      isOwner,
      errorMessage: error || 'Estabelecimento não encontrado'
    }
  }

  return {
    state: 'success',
    establishment,
    isOwner,
    errorMessage: null
  }
}
