# README

O que é a aplicação?

A aplicação é um sistema de gerenciamento de restaurantes.

Como rodar a aplicação?
1. Clone o repositório
2. Rode o comando `bundle install`
3. Rode o comando `rails db:create`
4. Rode o comando `rails db:migrate`
5. Rode o comando `rails db:seed`
6. Rode o comando `rails server`

Como rodar os testes?
1. Rode o comando `rspec`

Regras de negócio

1. O usuário dono do restaurante é o primeiro usuário cadastrado.
2. O usuário dono do restaurante é o único que pode cadastrar outros usuários (funcionários).
3. O usuário dono do restaurante é o único que pode criar cardápios.
4. O usuário dono do restaurante é o único que pode criar pratos e bebidas.
