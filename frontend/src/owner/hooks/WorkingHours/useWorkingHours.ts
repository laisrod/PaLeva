import { useState, useEffect, useCallback } from 'react'
import { ownerApi } from '../../services/api'
import { useApiData } from '../Api/useApiData'
import { getErrorMessage } from '../errorHandler'
import { WorkingHour, WorkingHourUpdate, UseWorkingHoursOptions } from '../../types/workingHours'

const SUCCESS_MESSAGE_DELAY = 1500

export function useWorkingHours({ code, onSuccess }: UseWorkingHoursOptions) {
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([])
  const [successMessage, setSuccessMessage] = useState('')
  const [saving, setSaving] = useState(false)
  
  const { loading, error, executeRequest, setError } = useApiData<WorkingHour[]>({
    defaultErrorMessage: 'Erro ao carregar horários de funcionamento',
    onSuccess: (data) => setWorkingHours(data)
  })

  const loadWorkingHours = useCallback(async () => {
    if (!code) {
      return
    }
    
    await executeRequest(() => ownerApi.getWorkingHours(code))
  }, [code, executeRequest])

  useEffect(() => {
    if (code) {
      loadWorkingHours()
    }
  }, [code])

  const handleChange = useCallback((id: number, field: string, value: string | boolean) => {
    setWorkingHours((previousHours) => {
      return previousHours.map((hour) => {
        if (hour.id === id) {
          return { ...hour, [field]: value }
        }
        return hour
      })
    })
    
    setSuccessMessage('')
    setError('')
  }, [setError])

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    
    if (!code) {
      return
    }

    setSaving(true)
    setError('')
    setSuccessMessage('')

    try {
      const updatePromises = workingHours.map((hour) => {
        const updateData: WorkingHourUpdate = {
          opening_hour: hour.opening_hour || '',
          closing_hour: hour.closing_hour || '',
          open: hour.open
        }
        
        return ownerApi.updateWorkingHour(code, hour.id, updateData)
      })

      const results = await Promise.all(updatePromises)
      
      const hasAnyError = results.some((result) => {
        const errorMessage = getErrorMessage(result)
        return !!errorMessage
      })

      if (hasAnyError) {
        const errorMessages = results
          .map((result) => getErrorMessage(result))
          .filter((message) => message)
        
        setError(errorMessages.join(', '))
      } else {
        setSuccessMessage('Horários de funcionamento atualizados com sucesso!')
        
        if (onSuccess) {
          setTimeout(() => {
            onSuccess()
          }, SUCCESS_MESSAGE_DELAY)
        }
      }
    } catch (err) {
      setError('Erro ao atualizar horários de funcionamento')
    } finally {
      setSaving(false)
    }
  }, [code, workingHours, onSuccess, setError])

  return {
    workingHours,
    loading,
    saving,
    error,
    success: successMessage,
    handleChange,
    handleSubmit
  }
}
