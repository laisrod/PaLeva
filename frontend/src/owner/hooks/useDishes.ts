import { useState, useEffect } from 'react'
import { api } from '../../shared/services/api'

interface Dish {
  id: number
  name: string
  description?: string
  tags?: Array<{
    id: number
    name: string
  }>
}

interface Tag {
  id: number
  name: string
}

export function useDishes(establishmentCode: string | undefined) {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Carregar tags
  useEffect(() => {
    if (establishmentCode) {
      loadTags()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [establishmentCode])

  // Carregar pratos quando tags selecionadas mudarem
  useEffect(() => {
    if (establishmentCode) {
      loadDishes()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [establishmentCode, selectedTags])

  const loadTags = async () => {
    if (!establishmentCode) return
    
    try {
      const response = await api.getTags(establishmentCode)
      if (response.data) {
        setTags(response.data)
      }
    } catch (err) {
      console.error('Erro ao carregar tags:', err)
    }
  }

  const loadDishes = async () => {
    setLoading(true)
    setError('')
    
    try {
      const tagIds = selectedTags.length > 0 ? selectedTags : undefined
      const response = await api.getDishes(establishmentCode!, tagIds)
      
      if (response.error) {
        setError(Array.isArray(response.error) 
          ? response.error.join(', ') 
          : response.error)
      } else if (response.data) {
        setDishes(response.data)
      }
    } catch (err) {
      setError('Erro ao carregar pratos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  return {
    dishes,
    tags,
    selectedTags,
    loading,
    error,
    toggleTag,
    refetch: loadDishes
  }
}

