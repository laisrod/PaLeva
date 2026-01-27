import { useParams } from 'react-router-dom'
import { useEditEstablishment } from './useEditEstablishment'

export function useEditEstablishmentPage() {
  const { code } = useParams<{ code: string }>()
  return useEditEstablishment(code)
}
