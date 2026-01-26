export function getStatusBadge(status: string): { label: string; color: string } {
  const badges: Record<string, { label: string; color: string }> = {
    draft: { label: 'Rascunho', color: '#9ca3af' }, // Cinza
    pending: { label: 'Aguardando confirmação', color: '#f97316' }, // Laranja
    preparing: { label: 'Em preparo', color: '#3b82f6' }, // Azul
    ready: { label: 'Pronto!', color: '#10b981' }, // Verde
    delivered: { label: 'Entregue', color: '#8b5cf6' }, // Roxo
    cancelled: { label: 'Cancelado', color: '#ef4444' }, // Vermelho
  }
  return badges[status] || { label: status, color: '#6b7280' }
}
