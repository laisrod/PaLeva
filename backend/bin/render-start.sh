#!/bin/bash
set -e

# Script de inicialização para Render
# Roda migrations e inicia o servidor

echo "Running database migrations..."
bundle exec rails db:migrate RAILS_ENV=production || echo "Migration failed or already up to date"

echo "Starting Puma server..."
exec bundle exec puma -C config/puma.rb
