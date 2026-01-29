import { useHomeRedirect } from '../hooks/useHomeRedirect'

export default function Home() {
  useHomeRedirect()

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <p>Redirecionando...</p>
    </div>
  )
}
