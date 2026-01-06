# Backend - PaLeva

Aplicação Rails que serve como backend para o sistema PaLeva.

##  Estrutura Organizada

O backend segue boas práticas de arquitetura Rails:

- **Controllers magros** - Lógica de negócio em services
- **Services** - Encapsulam regras de negócio complexas
- **Concerns** - Código compartilhado reutilizável
- **Models limpos** - Apenas relacionamentos, validações e métodos do domínio

##  Configuração Inicial

```bash
bundle install
rails db:create
rails db:migrate
rails db:seed
```

## 🏃 Executando

### Desenvolvimento Local

Para rodar o backend:

```bash
# No diretório backend/
rails server
```

O servidor estará disponível em `http://localhost:3000`

**Nota:** Se você também precisa rodar o frontend React (em `/frontend`), abra outro terminal:

```bash
# No diretório frontend/
npm run dev
```

O frontend estará disponível em `http://localhost:5176` e fará proxy das requisições `/api` para o backend.

##  Documentação

- **Arquitetura:** Ver `ARCHITECTURE.md`
- **API:** Ver `config/routes.rb` namespace `api/v1`

##  Estrutura de Diretórios

```
app/
├── controllers/
│   ├── api/v1/          # API REST
│   ├── concerns/        # Concerns de controllers
│   └── *.rb            # Controllers web
├── models/
│   ├── concerns/        # Concerns de models
│   └── *.rb            # Models do domínio
├── services/            # Lógica de negócio
└── views/               # Templates ERB
```

##  Testes

```bash
rspec
```

