import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../../../../shared/services/api'
import { useApiData } from '../../../../shared/hooks/Api/useApiData'
import { Establishment } from '../../types/establishment'

export function useEstablishment(code: string | undefined) {
  const [establishment, setEstablishment] = useState<Establishment | null>(null)
  
  const { loading, error, executeRequest, setError, setLoading } = useApiData<Establishment>({
    defaultErrorMessage: 'Erro ao carregar estabelecimento',
    onSuccess: (data) => setEstablishment(data)
  })

  const loadEstablishment = useCallback(async (establishmentCode: string) => {
    await executeRequest(
      async () => {
        const response = await ownerApi.getEstablishment(establishmentCode)
        return response as { data?: Establishment, error?: string | string[], errors?: string[] }
      },
      'Estabelecimento não encontrado'
    )
  }, [executeRequest])

  useEffect(() => {
    if (code) {
      localStorage.setItem('establishment_code', code)
      loadEstablishment(code)
    } else {
      setError('Código do estabelecimento não encontrado')
      setLoading(false)
    }
  }, [code])

  return { 
    establishment, 
    loading, 
    error 
  }
}
