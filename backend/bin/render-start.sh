#!/bin/bash
# Script de inicialização para Render
# Roda migrations e inicia o servidor
# Não usa set -e para não parar em caso de erro não crítico

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

cd "$WORK_DIR" || {
  echo "ERROR: Could not change to directory $WORK_DIR"
  exit 1
}

echo "Working directory: $(pwd)"
echo "Listing files:"
ls -la | head -10

echo "Checking DATABASE_URL..."
if [ -z "$DATABASE_URL" ]; then
  echo "WARNING: DATABASE_URL is not set, but continuing..."
else
  echo "DATABASE_URL is set: ${DATABASE_URL:0:50}..."
fi

echo "Running database migrations..."
# Tentar db:prepare primeiro
if bundle exec rails db:prepare RAILS_ENV=production 2>&1; then
  echo "✅ db:prepare completed successfully!"
elif bundle exec rails db:migrate RAILS_ENV=production 2>&1; then
  echo "✅ db:migrate completed successfully!"
else
  echo "⚠️ Migrations failed, but continuing to start server..."
  echo "You may need to run migrations manually"
fi

echo "Starting Puma server..."
exec bundle exec puma -C config/puma.rb
