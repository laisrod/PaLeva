import { useState, useCallback, useRef, useEffect } from 'react'
import { getErrorMessage } from '../errorHandler'

interface UseApiDataOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
  defaultErrorMessage?: string
}

//gerenciar estado de requisições API
 //Retorna estados de loading, error e função para executar requisições
 
export function useApiData<T>(options: UseApiDataOptions<T> = {}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Usar refs para evitar que mudanças nas callbacks causem re-renders
  const optionsRef = useRef(options)
  useEffect(() => {
    optionsRef.current = options
  }, [options])

  const executeRequest = useCallback(async (
    apiCall: () => Promise<{ data?: T, error?: string | string[], errors?: string[] }>,
    customErrorMessage?: string
  ): Promise<T | null> => {
    setLoading(true)
    setError('')

    try {
      const response = await apiCall()
      const { onSuccess, onError, defaultErrorMessage } = optionsRef.current
      
      const errorMessage = getErrorMessage(response)
      
      if (errorMessage) {
        const finalError = customErrorMessage || errorMessage
        setError(finalError)
        onError?.(finalError)
        return null
      }

      if (response.data) {
        onSuccess?.(response.data)
        return response.data
      }

      const finalError = customErrorMessage || defaultErrorMessage || 'Erro na requisição'
      setError(finalError)
      onError?.(finalError)
      return null
    } catch (err) {
      const { onError, defaultErrorMessage } = optionsRef.current
      const finalError = customErrorMessage || defaultErrorMessage || 'Erro desconhecido'
      setError(finalError)
      console.error(err)
      onError?.(finalError)
      return null
    } finally {
      setLoading(false)
    }
  }, []) // Sem dependências - usa ref para acessar callbacks atualizadas

  return {
    loading,
    error,
    executeRequest,
    setError,
    setLoading
  }
}
