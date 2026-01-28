import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ownerApi } from '../../services/api'
import { getErrorMessage } from '../errorHandler'
import { TagCategory } from '../../types/tag'

export function useCreateTag(establishmentCode: string | undefined, category: TagCategory) {
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
    name,
    loading,
    errors,
    handleChange,
    handleSubmit,
  }
}
