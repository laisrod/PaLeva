import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ownerApi } from '../../../../shared/services/api'
import { getErrorMessage } from '../../../../shared/hooks/errorHandler'

export function useEditTag(establishmentCode: string | undefined, tagId: string | undefined) {
  const navigate = useNavigate()
  const id = tagId ? parseInt(tagId, 10) : NaN
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingTag, setLoadingTag] = useState(true)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (!establishmentCode || !id || isNaN(id)) {
      setLoadingTag(false)
      return
    }
    let cancelled = false
    setLoadingTag(true)
    ownerApi
      .getTag(establishmentCode, id)
      .then((res) => {
        if (cancelled) return
        const err = getErrorMessage(res)
        if (err) {
          setErrors([err])
          return
        }
        if (res.data && typeof res.data === 'object' && 'name' in res.data) {
          setName(String((res.data as { name: string }).name))
        }
      })
      .catch(() => {
        if (!cancelled) setErrors(['Erro ao carregar característica'])
      })
      .finally(() => {
        if (!cancelled) setLoadingTag(false)
      })
    return () => { cancelled = true }
  }, [establishmentCode, id])

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
      if (!establishmentCode || !id || isNaN(id)) {
        setErrors(['Dados inválidos'])
        return
      }
      setLoading(true)
      try {
        const res = await ownerApi.updateTag(establishmentCode, id, trimmed)
        const err = getErrorMessage(res)
        if (err) {
          setErrors([err])
          return
        }
        navigate(`/establishment/${establishmentCode}/tags`)
      } catch {
        setErrors(['Erro ao atualizar característica. Tente novamente.'])
      } finally {
        setLoading(false)
      }
    },
    [name, establishmentCode, id, navigate]
  )

  return {
    establishmentCode: establishmentCode ?? '',
    tagId: id,
    name,
    loading,
    loadingTag,
    errors,
    handleChange,
    handleSubmit,
  }
}
