# Como criar uma página React que mostra dados do Sidekiq

Guia passo a passo para iniciantes. Vamos construir uma página de monitoramento
de jobs em background integrando Rails (backend) com React (frontend).

---

## O que vamos construir

Uma página no dashboard do proprietário que mostra:
- Quantos jobs foram processados, falharam, estão na fila etc.
- A lista de filas ativas com status

---

## Conceitos antes de começar

| Conceito | O que é |
|---|---|
| **Sidekiq** | Biblioteca Ruby que executa tarefas pesadas em segundo plano (ex: enviar e-mail) |
| **Redis** | Banco de dados em memória onde o Sidekiq guarda a fila de jobs |
| **API endpoint** | Uma URL no backend que retorna dados em JSON |
| **Hook React** | Função que gerencia estado e efeitos colaterais num componente |
| **Interface TypeScript** | "Contrato" que descreve a forma de um objeto JS |

---

## Visão geral da arquitetura

```
[Página React]
     |
     | chama
     v
[Hook: useSidekiqStats]
     |
     | usa
     v
[Service: SidekiqApi]
     |
     | faz request HTTP
     v
[Controller Rails: SidekiqStatsController]
     |
     | consulta
     v
[Sidekiq::Stats + Redis]
```

---

## Passo 1 — Criar o endpoint no backend

O Rails precisa expor uma URL que retorne as estatísticas do Sidekiq.

**Arquivo:** `backend/app/controllers/api/v1/sidekiq_stats_controller.rb`

```ruby
require 'sidekiq/api'  # carrega as classes do Sidekiq

module Api
  module V1
    class SidekiqStatsController < ApplicationController
      include AuthenticableApi
      before_action :authenticate_api_user!  # só usuários logados
      skip_before_action :verify_authenticity_token
      skip_before_action :create_current_order
      skip_before_action :set_active_storage_url_options

      def index
        stats = Sidekiq::Stats.new  # pega as estatísticas globais

        # lista todas as filas com nome, tamanho e latência
        queues = Sidekiq::Queue.all.map do |queue|
          { name: queue.name, size: queue.size, latency: queue.latency.round(2) }
        end

        render json: {
          processed: stats.processed,   # total de jobs executados
          failed:    stats.failed,       # total de falhas
          enqueued:  stats.enqueued,     # aguardando na fila agora
          scheduled: stats.scheduled_size, # agendados para o futuro
          retries:   stats.retry_size,   # aguardando nova tentativa
          dead:      stats.dead_size,    # esgotaram todas as tentativas
          queues:    queues
        }
      rescue => e
        render json: { error: e.message }, status: :internal_server_error
      end
    end
  end
end
```

**Por que `require 'sidekiq/api'`?**
A classe `Sidekiq::Stats` não é carregada automaticamente — precisamos
importar o módulo explicitamente.

---

## Passo 2 — Registrar a rota

**Arquivo:** `backend/config/routes.rb`

```ruby
require 'sidekiq/web'

Rails.application.routes.draw do
  mount Sidekiq::Web => '/sidekiq'  # painel web do Sidekiq em /sidekiq

  namespace :api do
    namespace :v1 do
      # ... outras rotas ...
      get '/sidekiq/stats', to: 'sidekiq_stats#index'
    end
  end
end
```

Agora a URL `GET /api/v1/sidekiq/stats` retorna o JSON com as estatísticas.

---

## Passo 3 — Criar os tipos TypeScript

TypeScript exige que você descreva a "forma" dos dados que vai receber.
Isso evita erros em tempo de desenvolvimento.

**Arquivo:** `frontend/src/owner/features/sidekiq/types/sidekiq.ts`

```typescript
// Representa uma fila individual do Sidekiq
export interface SidekiqQueue {
  name: string      // ex: "mailers", "default"
  size: number      // quantos jobs estão esperando
  latency: number   // tempo (segundos) do job mais antigo na fila
}

// Representa todas as estatísticas retornadas pelo backend
export interface SidekiqStats {
  processed: number   // total de jobs executados com sucesso
  failed: number      // total de falhas históricas
  enqueued: number    // jobs aguardando execução agora
  scheduled: number   // jobs agendados para o futuro
  retries: number     // jobs aguardando nova tentativa
  dead: number        // jobs que esgotaram todas as tentativas
  queues: SidekiqQueue[]
}
```

**Por que criar interfaces?**
Sem interfaces, o TypeScript não sabe que `stats.processed` existe e
vai reclamar. Com interfaces, você tem autocomplete e proteção contra typos.

---

## Passo 4 — Criar o serviço (chamada HTTP)

O serviço é responsável apenas por fazer a requisição ao backend.
Ele não sabe nada sobre componentes React — só sobre HTTP.

**Arquivo:** `frontend/src/owner/features/sidekiq/services/sidekiq.ts`

```typescript
import { BaseApiService } from '../../../shared/services/api/base'
import { SidekiqStats } from '../types/sidekiq'

export class SidekiqApi extends BaseApiService {
  getStats() {
    // BaseApiService.request() cuida do token de autenticação,
    // base URL, tratamento de erros etc.
    return this.request<SidekiqStats>('/sidekiq/stats')
  }
}
```

**Por que separar o serviço do hook?**
Separação de responsabilidades:
- O serviço sabe *como* buscar os dados (HTTP)
- O hook sabe *quando* buscar e *onde* guardar (estado React)
- O componente sabe *como mostrar* os dados (JSX)

---

## Passo 5 — Registrar o serviço no ownerApi

O projeto usa um objeto central `ownerApi` que agrupa todos os serviços.
Precisamos adicionar o Sidekiq nele.

**Arquivo:** `frontend/src/owner/shared/services/api/index.ts`

```typescript
// 1. Importar a classe
import { SidekiqApi } from '../../../features/sidekiq/services/sidekiq'

class OwnerApiService extends BaseApiService {
  // 2. Declarar a propriedade
  sidekiq: SidekiqApi

  constructor() {
    super()
    // 3. Inicializar no construtor
    this.sidekiq = new SidekiqApi()
  }

  // 4. Criar método de atalho (padrão do projeto)
  getSidekiqStats() {
    return this.sidekiq.getStats()
  }
}

export const ownerApi = new OwnerApiService()
```

---

## Passo 6 — Criar o hook (estado + busca automática)

O hook gerencia o estado (`stats`, `loading`, `error`) e
busca os dados do backend, repetindo a cada 5 segundos.

**Arquivo:** `frontend/src/owner/features/sidekiq/hooks/useSidekiqStats.ts`

```typescript
import { useState, useEffect, useCallback } from 'react'
import { SidekiqStats } from '../types/sidekiq'
import { ownerApi } from '../../../shared/services/api'

// Estado inicial vazio — evita erros de "undefined" nos componentes
const EMPTY_STATS: SidekiqStats = {
  processed: 0, failed: 0, enqueued: 0,
  scheduled: 0, retries: 0, dead: 0, queues: []
}

export function useSidekiqStats(refreshInterval = 5000) {
  const [stats, setStats] = useState<SidekiqStats>(EMPTY_STATS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // useCallback evita que fetchStats seja recriada a cada render
  const fetchStats = useCallback(async () => {
    const response = await ownerApi.getSidekiqStats()
    if (response.error) {
      setError(typeof response.error === 'string'
        ? response.error
        : response.error.join(', '))
    } else if (response.data) {
      setStats(response.data)
      setError(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchStats()  // busca imediatamente ao montar

    // repete a cada refreshInterval milissegundos (padrão: 5000ms = 5s)
    const interval = setInterval(fetchStats, refreshInterval)

    // cleanup: cancela o intervalo quando o componente desmonta
    return () => clearInterval(interval)
  }, [fetchStats, refreshInterval])

  return { stats, loading, error, refresh: fetchStats }
}
```

**Por que `useCallback`?**
Sem `useCallback`, a função `fetchStats` seria recriada em todo render,
o que faria o `useEffect` disparar em loop infinito.

**Por que `return () => clearInterval(interval)`?**
Quando o usuário navegar para outra página, o componente "desmonta".
Sem o cleanup, o intervalo continuaria rodando em background e tentaria
atualizar um componente que não existe mais — causando memory leak.

---

## Passo 7 — Criar os componentes React

A estrutura segue o padrão do projeto: um componente "página" (Dashboard),
um "conteúdo" (Content) e subcomponentes especializados.

### SidekiqDashboard.tsx — página raiz (só monta o Layout)

```typescript
import Layout from '../../../../shared/components/Layout/Layout'
import SidekiqContent from './SidekiqContent'
import '../../../../../css/owner/Dashboard.css'

export default function SidekiqDashboard() {
  return (
    <Layout>
      <SidekiqContent />
    </Layout>
  )
}
```

### SidekiqContent.tsx — orquestra tudo

```typescript
import { useSidekiqStats } from '../../hooks/useSidekiqStats'
import SidekiqStatsCards from './SidekiqStatsCards'
import SidekiqQueuesList from './SidekiqQueuesList'

export default function SidekiqContent() {
  // Uma única linha busca os dados, o loading e o erro
  const { stats, loading, error, refresh } = useSidekiqStats(5000)

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Jobs em Background</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <button onClick={refresh}>↻ Atualizar</button>

      <SidekiqStatsCards stats={stats} />
      <SidekiqQueuesList queues={stats.queues} />
    </div>
  )
}
```

### SidekiqStatsCards.tsx — cards com os números

```typescript
import { SidekiqStats } from '../../types/sidekiq'

interface Props { stats: SidekiqStats }

export default function SidekiqStatsCards({ stats }: Props) {
  const cards = [
    { label: 'Processados', value: stats.processed, color: '#4caf50' },
    { label: 'Falhas',      value: stats.failed,    color: '#f44336' },
    { label: 'Na Fila',     value: stats.enqueued,  color: '#ff9800' },
    // ...
  ]

  return (
    <div className="stats-cards-grid">
      {cards.map(card => (
        <div className="stat-card" key={card.label}>
          <h4>{card.label}</h4>
          <p style={{ color: card.color }}>{card.value}</p>
        </div>
      ))}
    </div>
  )
}
```

---

## Passo 8 — Adicionar a rota no React Router

**Arquivo:** `frontend/src/components/AppRoutes.tsx`

```typescript
// 1. Importar o componente
import SidekiqDashboard from '../owner/features/sidekiq/components/SidekiqDashboard/SidekiqDashboard'

export default function AppRoutes() {
  return (
    <Routes>
      {/* ... outras rotas ... */}

      {/* 2. Adicionar a nova rota */}
      <Route path="/establishment/:code/jobs" element={<SidekiqDashboard />} />
    </Routes>
  )
}
```

Agora a URL `http://localhost:5177/establishment/SEU_CODIGO/jobs` funciona.

---

## Passo 9 — Adicionar o link na navbar

**Arquivo:** `frontend/src/owner/shared/components/Layout/Layout.tsx`

```tsx
<Link
  to={`/establishment/${establishmentCode}/jobs`}
  className={`owner-nav-link ${isActive('/jobs') ? 'active' : ''}`}
  title="Jobs em Background (Sidekiq)"
>
  {/* ícone de engrenagem SVG */}
  <svg>...</svg>
</Link>
```

---

## Estrutura final de arquivos

```
frontend/src/owner/features/sidekiq/
├── types/
│   └── sidekiq.ts          ← interfaces TypeScript
├── services/
│   └── sidekiq.ts          ← chamada HTTP ao backend
├── hooks/
│   └── useSidekiqStats.ts  ← estado + polling automático
└── components/
    └── SidekiqDashboard/
        ├── SidekiqDashboard.tsx    ← página raiz (Layout)
        ├── SidekiqContent.tsx      ← orquestra dados e subcomponentes
        ├── SidekiqStatsCards.tsx   ← cards com os números
        └── SidekiqQueuesList.tsx   ← tabela de filas
```

---

## Fluxo completo em tempo de execução

```
1. Usuário acessa /establishment/abc/jobs
2. React renderiza SidekiqDashboard → SidekiqContent
3. SidekiqContent chama useSidekiqStats(5000)
4. Hook dispara fetchStats() imediatamente
5. fetchStats() chama ownerApi.getSidekiqStats()
6. SidekiqApi faz GET /api/v1/sidekiq/stats com o token JWT
7. Rails autentica o usuário e chama SidekiqStatsController#index
8. Controller consulta Sidekiq::Stats e Sidekiq::Queue.all no Redis
9. Retorna JSON com os dados
10. Hook atualiza o estado (setStats)
11. React re-renderiza os cards e a tabela com os novos valores
12. Após 5 segundos, o processo repete a partir do passo 4
```

---

## Como testar

1. **Suba o Redis:**
   ```bash
   redis-server
   ```

2. **Suba o Rails:**
   ```bash
   cd backend && bundle exec rails server
   ```

3. **Suba o Sidekiq:**
   ```bash
   cd backend && bundle exec sidekiq -q mailers -q default
   ```

4. **Suba o frontend:**
   ```bash
   cd frontend && npm run dev
   ```

5. **Enfileira um job de teste:**
   ```bash
   cd backend && bundle exec rails runner "SendOrderStatusJob.perform_later(1)"
   ```

6. **Acesse a página:**
   ```
   http://localhost:5177/establishment/SEU_CODIGO/jobs
   ```

Você verá os contadores atualizando automaticamente a cada 5 segundos.
