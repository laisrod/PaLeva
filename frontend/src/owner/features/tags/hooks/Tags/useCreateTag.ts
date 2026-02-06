import { useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ownerApi } from '../../../../shared/services/api'
import { getErrorMessage } from '../../../../shared/hooks/errorHandler'
import { TagCategory, getCategoryFromSearchParams, getTagCategoryTitle } from '../../../tags/types/tag'

interface UseCreateTagReturn {
  establishmentCode: string
  category: TagCategory
  title: string
  name: string
  loading: boolean
  errors: string[]
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
}

export function useCreateTag(establishmentCode: string | undefined): UseCreateTagReturn {
  const [searchParams] = useSearchParams()
  const category = getCategoryFromSearchParams(searchParams)
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    if (errors.length > 0) setErrors([])
  }, [errors.length])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setErrors([])
      const trimmed = name.trim()
      if (!trimmed) {
        setErrors(['Nome é obrigatório'])
        return
      }
      if (!establishmentCode) {
        setErrors(['Estabelecimento não encontrado'])
        return
      }
      setLoading(true)
      try {
        const res = await ownerApi.createTag(establishmentCode, trimmed, category)
        const err = getErrorMessage(res)
        if (err) {
          setErrors([err])
          return
        }
        navigate(`/establishment/${establishmentCode}/tags`)
      } catch {
        setErrors(['Erro ao criar característica. Tente novamente.'])
      } finally {
        setLoading(false)
      }
    },
    [name, establishmentCode, category, navigate]
  )

  return {
    establishmentCode: establishmentCode ?? '',
    category,
    title: getTagCategoryTitle(category),
    name,
    loading,
    errors,
    handleChange,
    handleSubmit,
  }
}
