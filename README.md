# PaLeva - Sistema de Gerenciamento de Restaurantes

Sistema completo de gerenciamento de restaurantes com backend Rails e frontend React, desenvolvido com tema escuro moderno.

## Estrutura do Projeto

```
PaLeva/
├── backend/          # API Rails
├── frontend/         # Aplicação React (Vite + TypeScript)
└── README.md         # Este arquivo
```

## Funcionalidades

### Área do Proprietário (Owner)

- **Dashboard**: Visão geral do estabelecimento com estatísticas
- **Pratos**: Cadastro, edição e gerenciamento de pratos com porções
- **Bebidas**: Cadastro, edição e gerenciamento de bebidas com porções
- **Cardápios**: Criação e gerenciamento de cardápios com itens
- **Pedidos**: Visualização e gerenciamento de pedidos
- **Características (Tags)**: Tags separadas para pratos e bebidas
- **Horários de Funcionamento**: Configuração de horários por dia da semana
- **Estabelecimento**: Edição de dados do estabelecimento

### Área do Cliente

- **Lista de Restaurantes**: Visualização de restaurantes disponíveis
- **Menu**: Visualização do cardápio do restaurante
- **Carrinho**: Adição de itens e finalização de pedidos

## Tecnologias

### Backend
- Ruby on Rails 7
- PostgreSQL
- Devise (autenticação)
- RSpec (testes)

### Frontend
- React 18
- TypeScript
- Vite
- React Router DOM
- CSS Modules com variáveis CSS

## Como Rodar

### Backend (Rails)

```bash
cd backend
bundle install
rails db:create db:migrate db:seed
rails server
```

O backend estará disponível em `http://localhost:3000`

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5176`

## Testes

### Backend
```bash
cd backend
rspec
```

## Arquitetura do Frontend

```
frontend/src/
├── assets/           # Ícones SVG
├── client/           # Componentes e páginas do cliente
│   ├── components/   # Componentes reutilizáveis
│   ├── hooks/        # Hooks customizados
│   └── pages/        # Páginas
├── components/       # Componentes compartilhados (AppRoutes, etc.)
├── css/              # Estilos CSS
│   ├── client/       # Estilos da área do cliente
│   ├── owner/        # Estilos da área do proprietário
│   └── shared/       # Variáveis e estilos compartilhados
├── owner/            # Componentes e lógica do proprietário
│   ├── components/   # Componentes organizados por domínio
│   ├── hooks/        # Hooks customizados
│   ├── services/     # Serviços de API
│   └── types/        # Tipos TypeScript
└── shared/           # Código compartilhado
    ├── hooks/        # useAuth, etc.
    ├── pages/        # Login, Register
    ├── services/     # API compartilhada
    └── utils/        # Utilitários
```

## Regras de Negócio

1. O primeiro usuário cadastrado é o dono do restaurante
2. Apenas o proprietário pode:
   - Cadastrar funcionários
   - Criar/editar cardápios
   - Criar/editar pratos e bebidas
   - Gerenciar características (tags)
   - Configurar horários de funcionamento
3. Tags são separadas por categoria (pratos/bebidas)
4. Cada prato/bebida pode ter múltiplas porções com preços diferentes

## Design

O sistema utiliza um tema escuro moderno com:
- Cor primária: `#FF7F3F` (laranja)
- Background: `#252836` (escuro)
- Cards: `#1F1D2B` (escuro secundário)
- Ícones SVG customizados na navegação

## Credenciais de Teste

Após rodar o `rails db:seed`:
- **Email**: owner@example.com
- **Senha**: 123456

## Documentação Adicional

- [Arquitetura do Backend](backend/ARCHITECTURE.md)
- [Refatorações Realizadas](backend/REFACTORING.md)
- [Guia de React no Rails](backend/REACT_GUIDE.md)
