import '../../../css/owner/Dashboard.css'

interface TopItemsListProps {
  items: Array<{
    name: string
    quantity: number
    revenue: string
  }>
}

export default function TopItemsList({ items }: TopItemsListProps) {
  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numValue)
  }

  if (items.length === 0) {
    return (
      <div className="top-items-empty">
        <p>Nenhum item vendido no período selecionado</p>
      </div>
    )
  }

  return (
    <div className="top-items-list">
      <table className="top-items-table">
        <thead>
          <tr>
            <th>Posição</th>
            <th>Item</th>
            <th>Quantidade</th>
            <th>Receita</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td className="position-cell">
                <span className={`position-badge ${index < 3 ? 'top-' + (index + 1) : ''}`}>
                  {index + 1}º
                </span>
              </td>
              <td className="item-name">{item.name}</td>
              <td className="item-quantity">{item.quantity}</td>
              <td className="item-revenue">{formatCurrency(item.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
