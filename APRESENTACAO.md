# 🍽️ PaLeva - Sistema de Gerenciamento de Restaurantes

## 📋 Índice
1. [O que é o PaLeva?](#o-que-é-o-paleva)
2. [Principais Funcionalidades](#principais-funcionalidades)
3. [Como Funciona?](#como-funciona)
4. [Tecnologias Utilizadas](#tecnologias-utilizadas)
5. [Estrutura do Sistema](#estrutura-do-sistema)
6. [Fluxos Principais](#fluxos-principais)
7. [Regras de Negócio](#regras-de-negócio)
8. [Como Usar](#como-usar)

---

## 🎯 O que é o PaLeva?

O **PaLeva** é um sistema completo de gerenciamento de restaurantes desenvolvido em Ruby on Rails. Ele permite que restaurantes gerenciem seus cardápios, pedidos, funcionários e operações diárias de forma digital e organizada.

### Objetivo Principal
Facilitar a gestão de restaurantes, desde o cadastro de pratos e bebidas até o controle completo de pedidos, com suporte para múltiplos usuários e diferentes níveis de acesso.

---

## ✨ Principais Funcionalidades

### 1. **Gestão de Estabelecimentos**
- Cadastro completo de restaurantes com dados como CNPJ, endereço, telefone
- Geração automática de código único para cada estabelecimento
- Controle de horários de funcionamento por dia da semana

### 2. **Gestão de Cardápio**
- Cadastro de **pratos** (dishes) com descrição, calorias e fotos
- Cadastro de **bebidas** (drinks) com indicação se é alcoólica
- Criação de **porções** com diferentes tamanhos e preços
- Sistema de **tags** para categorizar pratos (ex: "vegetariano", "picante", "sem glúten")
- Histórico de preços para acompanhar mudanças ao longo do tempo

### 3. **Gestão de Menus**
- Criação de múltiplos cardápios (ex: "Menu Almoço", "Menu Jantar")
- Associação de pratos e bebidas aos menus
- Ativação/desativação de menus

### 4. **Gestão de Pedidos**
- Criação de pedidos com status em tempo real:
  - 📝 **Draft** (Rascunho) - Pedido sendo montado
  - ⏳ **Pending** (Pendente) - Aguardando confirmação
  - 👨‍🍳 **Preparing** (Preparando) - Em preparação
  - ✅ **Ready** (Pronto) - Pronto para entrega
  - 🚚 **Delivered** (Entregue) - Pedido finalizado
  - ❌ **Cancelled** (Cancelado) - Pedido cancelado
- Cálculo automático do valor total
- Código único para cada pedido
- Informações do cliente (nome, email, telefone, CPF)

### 5. **Gestão de Usuários**
- Sistema de autenticação com Devise
- Dois tipos de usuários:
  - **Dono** (Owner) - Acesso completo ao sistema
  - **Funcionário** (Employee) - Acesso limitado
- Convites para funcionários via email e CPF

### 6. **API REST**
- API para integração com aplicativos móveis
- Endpoints para consulta de estabelecimentos e pedidos
- Autenticação via API

---

## 🔄 Como Funciona?

### Fluxo de Cadastro Inicial

1. **Primeiro Usuário se Cadastra**
   - Cria conta com email, senha, nome, sobrenome e CPF
   - Automaticamente se torna **Dono** do restaurante

2. **Cadastro do Estabelecimento**
   - Preenche dados do restaurante (nome, CNPJ, endereço, etc.)
   - Sistema gera um **código único** para o estabelecimento
   - Horários de funcionamento são criados automaticamente para todos os dias

3. **Cadastro de Produtos**
   - Dono cadastra pratos e bebidas
   - Para cada produto, cria porções (ex: "Pequeno", "Médio", "Grande")
   - Define preços para cada porção

4. **Criação de Menus**
   - Dono cria menus e adiciona produtos a eles
   - Pode criar múltiplos menus (ex: "Menu Executivo", "Menu Vegetariano")

5. **Gestão de Pedidos**
   - Funcionários ou dono criam pedidos
   - Adicionam itens do menu ao pedido
   - Selecionam porção e quantidade
   - Atualizam status conforme o pedido avança

---

## 💻 Tecnologias Utilizadas

### Backend
- **Ruby on Rails 7.2** - Framework web principal
- **SQLite3** - Banco de dados (pode ser migrado para PostgreSQL em produção)
- **Devise** - Sistema de autenticação
- **Puma** - Servidor web

### Frontend
- **Bootstrap 5.3** - Framework CSS para interface
- **Sass** - Pré-processador CSS
- **Turbo Rails** - Aceleração de páginas (SPA-like)
- **Stimulus** - Framework JavaScript minimalista

### Outras Ferramentas
- **Active Storage** - Upload e gerenciamento de imagens
- **Rack CORS** - Suporte para requisições de diferentes origens (API)
- **CPF/CNPJ** - Validação de documentos brasileiros

---

## 🏗️ Estrutura do Sistema

### Modelos Principais (Entidades)

```
User (Usuário)
├── Estabelece → Establishment (Estabelecimento)
│   ├── Tem muitos → Dishes (Pratos)
│   ├── Tem muitos → Drinks (Bebidas)
│   ├── Tem muitos → Menus (Cardápios)
│   ├── Tem muitos → Orders (Pedidos)
│   ├── Tem muitos → WorkingHours (Horários)
│   └── Tem muitos → EmployeeInvitations (Convites)
│
Dish (Prato)
├── Tem muitos → Portions (Porções)
├── Tem muitos → DishTags (Tags)
└── Pode estar em → MenuItems (Itens de Menu)

Drink (Bebida)
├── Tem muitos → Portions (Porções)
└── Pode estar em → MenuItems (Itens de Menu)

Menu (Cardápio)
└── Tem muitos → MenuItems (Itens de Menu)

Order (Pedido)
└── Tem muitos → OrderMenuItems (Itens do Pedido)
    └── Referencia → Portion (Porção escolhida)
```

### Relacionamentos Importantes

- **1 Usuário** → **1 Estabelecimento** (relação 1:1)
- **1 Estabelecimento** → **Muitos Pratos/Bebidas** (relação 1:N)
- **1 Prato/Bebida** → **Muitas Porções** (relação 1:N)
- **1 Menu** → **Muitos MenuItems** (relação 1:N)
- **1 Pedido** → **Muitos OrderMenuItems** (relação 1:N)

---

## 🔀 Fluxos Principais

### Fluxo 1: Criação de um Pedido

```
1. Usuário acessa "Pedidos" → "Novo Pedido"
2. Sistema cria automaticamente um pedido em status "draft"
3. Usuário clica em "Adicionar Item"
4. Seleciona um Menu
5. Escolhe um item (prato ou bebida)
6. Seleciona a Porção desejada
7. Define a Quantidade
8. Item é adicionado ao pedido
9. Valor total é calculado automaticamente
10. Ao finalizar, preenche dados do cliente
11. Muda status para "pending"
```

### Fluxo 2: Atualização de Status do Pedido

```
Draft → Pending → Preparing → Ready → Delivered
                    ↓
                Cancelled (pode cancelar em qualquer momento)
```

### Fluxo 3: Convite de Funcionário

```
1. Dono acessa "Convites de Funcionários"
2. Preenche email e CPF do funcionário
3. Sistema cria convite
4. Funcionário se cadastra no sistema
5. Sistema verifica se há convite com email/CPF
6. Se encontrar, associa automaticamente ao estabelecimento
7. Funcionário recebe role "false" (não é dono)
```

---

## 📜 Regras de Negócio

### 1. **Hierarquia de Usuários**
- ✅ **Dono** pode fazer TUDO no sistema
- ❌ **Funcionário** NÃO pode:
  - Criar pratos ou bebidas
  - Criar menus
  - Cadastrar outros funcionários
  - Editar dados do estabelecimento

### 2. **Primeiro Usuário = Dono**
- O primeiro usuário cadastrado automaticamente se torna dono
- Ao criar um estabelecimento, o usuário recebe `role = true`

### 3. **Códigos Únicos**
- Cada estabelecimento recebe um código único de 12 caracteres (hex)
- Cada pedido recebe um código único de 16 caracteres (hex)
- Códigos são gerados automaticamente

### 4. **Validações**
- CPF e CNPJ são validados antes de salvar
- Email deve ter formato válido
- Pedido precisa de telefone OU email do cliente
- Preços devem ser positivos

### 5. **Histórico de Preços**
- Toda vez que uma porção tem seu preço alterado, um registro é criado em `PriceHistory`
- Permite rastrear mudanças de preço ao longo do tempo

### 6. **Status de Produtos**
- Pratos e bebidas podem ser ativados/desativados
- Produtos desativados não aparecem nos menus (mas podem estar em pedidos antigos)

---

## 🚀 Como Usar

### Para Desenvolvedores

```bash
# 1. Instalar dependências
bundle install

# 2. Criar banco de dados
rails db:create

# 3. Executar migrações
rails db:migrate

# 4. Popular com dados iniciais (opcional)
rails db:seed

# 5. Iniciar servidor
rails server

# 6. Acessar no navegador
# http://localhost:3000
```

### Para Usuários Finais

1. **Primeiro Acesso:**
   - Acesse a página inicial
   - Clique em "Cadastrar"
   - Preencha seus dados
   - Você será redirecionado para cadastrar seu restaurante

2. **Cadastrar Restaurante:**
   - Preencha todos os dados solicitados
   - CNPJ será validado automaticamente
   - Clique em "Salvar"

3. **Cadastrar Produtos:**
   - Vá em "Pratos" ou "Bebidas"
   - Clique em "Novo"
   - Preencha informações e faça upload de foto
   - Salve e adicione porções com preços

4. **Criar Menu:**
   - Vá em "Menus"
   - Clique em "Novo Menu"
   - Adicione itens (pratos e bebidas)
   - Salve

5. **Gerenciar Pedidos:**
   - Vá em "Pedidos"
   - Clique em "Novo Pedido"
   - Adicione itens do menu
   - Preencha dados do cliente
   - Atualize status conforme o pedido avança

---

## 📊 Dados Técnicos

### Banco de Dados
- **Desenvolvimento:** SQLite3 (arquivo local)
- **Produção:** Pode usar PostgreSQL ou manter SQLite com volume persistente

### Porta Padrão
- **3000** (configurável via variável `PORT`)

### Autenticação
- Sistema de login/logout com Devise
- Sessões persistentes (remember me)
- Recuperação de senha disponível

---

## 🎓 Conceitos Importantes para Iniciantes

### O que é Ruby on Rails?
Framework web que segue o padrão **MVC** (Model-View-Controller):
- **Model:** Representa os dados (ex: `User`, `Order`)
- **View:** Interface que o usuário vê (arquivos `.erb`)
- **Controller:** Lógica que conecta Model e View

### O que são Migrations?
Arquivos que definem mudanças no banco de dados. Permitem versionar a estrutura do banco.

### O que são Routes?
Definem quais URLs acessam quais controllers e ações. Exemplo:
- `/establishments` → lista estabelecimentos
- `/orders/new` → formulário de novo pedido

### O que é Active Record?
Camada que conecta Ruby com o banco de dados. Permite fazer queries como:
```ruby
Order.where(status: 'pending')
User.find_by(email: 'exemplo@email.com')
```

---

## 🔍 Exemplos Práticos

### Exemplo 1: Buscar todos os pedidos pendentes
```ruby
pending_orders = Order.where(status: 'pending')
```

### Exemplo 2: Calcular total de um pedido
```ruby
total = order.order_menu_items.sum do |item|
  item.portion.price * item.quantity
end
```

### Exemplo 3: Verificar se usuário é dono
```ruby
if current_user.owner?
  # Pode fazer ações de dono
end
```

---

## 📝 Notas Finais

- O sistema foi desenvolvido pensando em restaurantes brasileiros (validação de CPF/CNPJ)
- É possível expandir para suportar múltiplos estabelecimentos por usuário
- A API permite integração com aplicativos móveis
- O sistema suporta upload de imagens para produtos

---

## ❓ Perguntas Frequentes

**P: Posso ter mais de um restaurante?**
R: Atualmente, cada usuário pode ter apenas um estabelecimento. Isso pode ser expandido no futuro.

**P: Como funcionários acessam o sistema?**
R: O dono cria um convite com email e CPF. O funcionário se cadastra normalmente e é automaticamente associado ao estabelecimento.

**P: Posso cancelar um pedido já entregue?**
R: Não, apenas pedidos que ainda não foram entregues podem ser cancelados.

**P: Como altero o preço de um produto?**
R: Edite a porção do produto e altere o preço. O sistema mantém um histórico das mudanças.

---

**Desenvolvido com ❤️ usando Ruby on Rails**

