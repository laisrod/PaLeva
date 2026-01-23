export function getStatusBadge(status: string): { label: string; color: string } {
  const badges: Record<string, { label: string; color: string }> = {
    draft: { label: 'Rascunho', color: '#9ca3af' },
    pending: { label: 'Pendente', color: '#3b82f6' },
    preparing: { label: 'Preparando', color: '#f59e0b' },
    ready: { label: 'Pronto', color: '#10b981' },
    delivered: { label: 'Entregue', color: '#8b5cf6' },
    cancelled: { label: 'Cancelado', color: '#ef4444' },
  }
  return badges[status] || { label: status, color: '#6b7280' }
}
