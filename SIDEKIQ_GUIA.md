# Guia: Sidekiq + Redis no Rails para Iniciantes

## O que é e por que usar?

Imagine que um usuário cria um convite para um funcionário. O sistema precisa enviar um e-mail.
Se o e-mail for enviado **na hora**, o usuário fica esperando o servidor de e-mail responder — pode demorar segundos ou até falhar.

Com **Sidekiq + Redis**, o fluxo muda:

```
Usuário clica "Enviar convite"
        ↓
Rails salva o convite no banco (rápido)
        ↓
Rails coloca "enviar e-mail" numa FILA no Redis (rápido)
        ↓
Usuário recebe resposta imediata ✓
        ↓ (em paralelo, em background)
Sidekiq pega a tarefa da fila e envia o e-mail
```

**Redis** = cofre de tarefas pendentes (armazena a fila em memória)
**Sidekiq** = trabalhador que fica processando as tarefas da fila

---

## Passo 1 — Instalar o Redis

O Redis é um serviço externo. No Ubuntu/Debian:

```bash
# Adiciona repositório oficial do Redis (versão 7+)
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

sudo apt-get update && sudo apt-get install -y redis

# Verifica se está rodando
redis-cli ping
# Deve responder: PONG
```

---

## Passo 2 — Adicionar as gems

No `Gemfile`:

```ruby
gem "redis", ">= 4.0.1"       # cliente Ruby para o Redis
gem "sidekiq", "~> 7.0"       # processador de filas

# Abre e-mails no browser em vez de enviar de verdade (só em dev)
gem "letter_opener", group: :development
```

Depois:

```bash
bundle install
```

---

## Passo 3 — Configurar o Sidekiq

Crie o arquivo `config/initializers/sidekiq.rb`:

```ruby
Sidekiq.configure_server do |config|
  config.redis = { url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/0') }
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/0') }
end
```

- `configure_server` = configuração para o processo Sidekiq (quem processa)
- `configure_client` = configuração para o Rails (quem enfileira)
- `ENV.fetch('REDIS_URL', 'redis://localhost:6379/0')` = usa variável de ambiente em produção, localhost em desenvolvimento

---

## Passo 4 — Configurar o Active Job e o Mailer

Em `config/environments/development.rb`, adicione:

```ruby
# Diz ao Rails para usar Sidekiq como backend de jobs
config.active_job.queue_adapter = :sidekiq

# Abre e-mails no navegador (não envia de verdade em dev)
config.action_mailer.delivery_method = :letter_opener
config.action_mailer.perform_deliveries = true
config.action_mailer.raise_delivery_errors = true
```

---

## Passo 5 — Criar um Mailer

Um **Mailer** é a classe que monta o e-mail. Funciona igual a um controller, mas para e-mails.

```bash
rails generate mailer EmployeeInvitation
```

Edite `app/mailers/employee_invitation_mailer.rb`:

```ruby
class EmployeeInvitationMailer < ApplicationMailer
  def invite(invitation)
    @invitation = invitation
    @establishment = invitation.establishment

    mail(
      to: invitation.email,
      subject: "Convite para trabalhar em #{@establishment.name}"
    )
  end
end
```

Crie o template em `app/views/employee_invitation_mailer/invite.html.erb`:

```html
<h2>Você foi convidado para trabalhar em <%= @establishment.name %>!</h2>

<p>Acesse o sistema com o e-mail: <strong><%= @invitation.email %></strong></p>

<p><%= link_to 'Criar minha conta', new_user_registration_url %></p>
```

---

## Passo 6 — Criar um Job

Um **Job** é a tarefa que o Sidekiq vai executar. Ele recebe o ID do registro (não o objeto inteiro) porque pode rodar segundos depois, e o objeto pode ter mudado.

Crie `app/jobs/send_employee_invitation_job.rb`:

```ruby
class SendEmployeeInvitationJob < ApplicationJob
  queue_as :mailers  # nome da fila onde esse job vai entrar

  def perform(invitation_id)
    invitation = EmployeeInvitation.find(invitation_id)
    EmployeeInvitationMailer.invite(invitation).deliver_now
  end
end
```

> **Por que passar o ID e não o objeto?**
> O Sidekiq serializa os argumentos em JSON para salvar no Redis.
> Objetos Ruby não viram JSON. IDs (números) sim.
> Quando o job roda, ele busca o objeto fresco do banco.

---

## Passo 7 — Disparar o Job a partir do Model

Conecte o job ao model usando um callback do Rails:

```ruby
class EmployeeInvitation < ApplicationRecord
  # Após salvar no banco com sucesso, enfileira o job
  after_create_commit :send_invitation_email

  private

  def send_invitation_email
    SendEmployeeInvitationJob.perform_later(id)
    # perform_later = "coloca na fila agora, executa depois"
    # perform_now  = "executa agora, sem fila" (não usa Sidekiq)
  end
end
```

---

## Passo 8 — Painel Web do Sidekiq

O Sidekiq tem um painel visual para acompanhar as filas. Em `config/routes.rb`:

```ruby
require 'sidekiq/web'

Rails.application.routes.draw do
  mount Sidekiq::Web => '/sidekiq'
  # ...
end
```

Acesse `localhost:3000/sidekiq` para ver:
- Jobs processados
- Jobs na fila
- Jobs com falha (e reprocessar)
- Histórico

---

## Passo 9 — Rodar o Sidekiq

O Sidekiq é um processo separado do Rails. Você precisa rodar os dois:

**Terminal 1 — Rails:**
```bash
rails server
```

**Terminal 2 — Sidekiq:**
```bash
bundle exec sidekiq -q mailers -q default
```

- `-q mailers` = processa a fila "mailers"
- `-q default` = processa a fila padrão

---

## Fluxo completo resumido

```
Model salva registro
      ↓
after_create_commit dispara
      ↓
perform_later(id) → serializa job no Redis
      ↓
Sidekiq pega o job da fila
      ↓
Job busca o registro no banco pelo id
      ↓
Mailer monta e envia o e-mail
      ↓
Em dev: letter_opener abre o e-mail no browser
```

---

## Dicas para não errar

| Situação | O que fazer |
|---|---|
| Job não executa | Verifique se o Sidekiq está rodando (`ps aux | grep sidekiq`) |
| Redis não conecta | Verifique se o Redis está rodando (`redis-cli ping`) |
| E-mail não abre | Verifique se `letter_opener` está configurado no `development.rb` |
| Job falhou | Acesse `/sidekiq` → aba "Tentativas" para ver o erro e reprocessar |
| Quer testar sem Sidekiq | Use `perform_now` em vez de `perform_later` |

---

## Diferença entre perform_now e perform_later

```ruby
# Executa imediatamente, sem fila, sem Sidekiq
SendEmployeeInvitationJob.perform_now(invitation.id)

# Coloca na fila do Redis, Sidekiq executa em background
SendEmployeeInvitationJob.perform_later(invitation.id)

# Executa daqui 10 minutos
SendEmployeeInvitationJob.set(wait: 10.minutes).perform_later(invitation.id)

# Executa amanhã às 9h
SendEmployeeInvitationJob.set(wait_until: Date.tomorrow.noon).perform_later(invitation.id)
```
