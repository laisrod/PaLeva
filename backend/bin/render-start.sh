#!/bin/bash
set -e

# Script de inicialização para Render
# Roda migrations e inicia o servidor

echo "=========================================="
echo "Starting Render deployment script..."
echo "=========================================="

# Determinar o diretório de trabalho
if [ -d "/opt/render/project/src/backend" ]; then
  WORK_DIR="/opt/render/project/src/backend"
elif [ -d "backend" ]; then
  WORK_DIR="backend"
else
  WORK_DIR=$(pwd)
fi

cd "$WORK_DIR"
echo "Working directory: $(pwd)"

echo "Checking DATABASE_URL..."
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set!"
  exit 1
else
  echo "DATABASE_URL is set: ${DATABASE_URL:0:50}..."
fi

echo "Running database migrations..."
bundle exec rails db:prepare RAILS_ENV=production || {
  echo "db:prepare failed, trying db:migrate..."
  bundle exec rails db:migrate RAILS_ENV=production || {
    echo "db:migrate also failed, trying db:create db:migrate..."
    bundle exec rails db:create RAILS_ENV=production || true
    bundle exec rails db:migrate RAILS_ENV=production
  }
}

echo "✅ Database setup completed!"

echo "Starting Puma server..."
exec bundle exec puma -C config/puma.rb
