# PaLeva - Sistema de Gerenciamento de Restaurantes

Sistema completo de gerenciamento de restaurantes com backend Rails e frontend React.

## Estrutura do Projeto

```
PaLeva/
├── backend/          # Aplicação Rails (API + Views)
├── frontend/         # Aplicação React standalone
└── README.md         # Este arquivo
```

## Como rodar

### Backend (Rails)

```bash
cd backend
bundle install
rails db:create
rails db:migrate
rails db:seed
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

## Regras de Negócio

1. O usuário dono do restaurante é o primeiro usuário cadastrado.
2. O usuário dono do restaurante é o único que pode cadastrar outros usuários (funcionários).
3. O usuário dono do restaurante é o único que pode criar cardápios.
4. O usuário dono do restaurante é o único que pode criar pratos e bebidas.

## Documentação

- [Arquitetura do Backend](backend/ARCHITECTURE.md)
- [Refatorações Realizadas](backend/REFACTORING.md)
- [Guia de React no Rails](backend/REACT_GUIDE.md)
