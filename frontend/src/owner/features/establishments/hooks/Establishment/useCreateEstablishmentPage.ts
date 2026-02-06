import { useCreateEstablishment } from './useCreateEstablishment'
import { useRequireNewEstablishment } from './useRequireNewEstablishment'

// gerencia auth check e hook de criação
export function useCreateEstablishmentPage() {
  const { loading: authLoading } = useRequireNewEstablishment()
  const createEstablishment = useCreateEstablishment()

  return {
    authLoading,
    ...createEstablishment
  }
}
