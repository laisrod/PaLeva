import { useState, useEffect } from 'react'
import { api } from '../../shared/services/api'

interface Tag {
  id: number
  name: string
}

export function useTags(establishmentCode: string | undefined) {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (establishmentCode) {
      loadTags()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [establishmentCode])

  const loadTags = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await api.getTags()
      
      if (response.error) {
        setError(Array.isArray(response.error) 
          ? response.error.join(', ') 
          : response.error)
      } else if (response.data) {
        setTags(response.data)
      }
    } catch (err) {
      setError('Erro ao carregar características')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    tags,
    loading,
    error,
    refetch: loadTags
  }
}

