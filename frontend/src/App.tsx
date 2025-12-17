import { useMemo, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import './App.css'

type StatusStep = {
  label: string
  color: string
  progress: number
  badge: string
}

const STATUS_STEPS: StatusStep[] = [
  { label: 'Recebido', badge: '📥', color: '#7dd3fc', progress: 20 },
  { label: 'Preparando', badge: '🔥', color: '#fbbf24', progress: 45 },
  { label: 'Pronto', badge: '✅', color: '#34d399', progress: 75 },
  { label: 'Entregue', badge: '🚀', color: '#a78bfa', progress: 100 },
]

function App() {
  const [count, setCount] = useState<number>(0)
  const [step, setStep] = useState<number>(0)

  const current = useMemo(() => STATUS_STEPS[step], [step])

  const handleNext = () => setStep((prev) => (prev + 1) % STATUS_STEPS.length)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      <div className="card">
        <button onClick={() => setCount((value) => value + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <section className="status-card">
        <header>
          <div>
            <p className="eyebrow">Pedido #123</p>
            <h2>{current.badge} {current.label}</h2>
          </div>
          <span className="badge" style={{ background: current.color }}>
            {current.progress}%
          </span>
        </header>

        <div className="progress-track">
          <div
            className="progress-bar"
            style={{
              width: `${current.progress}%`,
              background: `linear-gradient(90deg, ${current.color}, #1f2937)`,
            }}
          />
        </div>

        <div className="status-actions">
          <p className="muted">Clique para avançar o status.</p>
          <button className="ghost" onClick={handleNext}>
            Próximo status
          </button>
        </div>
      </section>
    </>
  )
}

export default App

