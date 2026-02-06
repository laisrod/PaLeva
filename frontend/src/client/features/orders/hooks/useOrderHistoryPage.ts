import { useState } from 'react'
import { useOrderHistory } from './useOrderHistory'
import { useAuth } from '../../../../shared/hooks/useAuth'

export function useOrderHistoryPage() {
  const { orders, pagination, loading, error, filters, setFilters, refetch } = useOrderHistory()
  const { isOwner } = useAuth()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState('')

  const handleFilterChange = () => {
    setFilters({
      status: status || undefined,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      page: 1, // Reset to first page when filtering
    })
  }

  const handlePageChange = (newPage: number) => {
    setFilters({ page: newPage })
  }

  return {
    orders,
    pagination,
    loading,
    error,
    isOwner,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    status,
    setStatus,
    handleFilterChange,
    handlePageChange,
    refetch
  }
}
