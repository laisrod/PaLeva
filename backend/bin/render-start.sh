#!/bin/bash
set -e

# Script de inicialização para Render
# Roda migrations e inicia o servidor

echo "=========================================="
echo "Starting Render deployment script..."
echo "=========================================="

echo "Checking DATABASE_URL..."
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set!"
  exit 1
else
  echo "DATABASE_URL is set: ${DATABASE_URL:0:30}..."
fi

echo "Running database migrations..."
cd /opt/render/project/src/backend || cd backend || pwd
bundle exec rails db:migrate RAILS_ENV=production 2>&1 | tee /tmp/migration.log
MIGRATION_EXIT_CODE=${PIPESTATUS[0]}

if [ $MIGRATION_EXIT_CODE -eq 0 ]; then
  echo "✅ Migrations completed successfully!"
else
  echo "⚠️ Migration exit code: $MIGRATION_EXIT_CODE"
  echo "Migration log:"
  cat /tmp/migration.log
  echo "Continuing anyway..."
fi

echo "Starting Puma server..."
exec bundle exec puma -C config/puma.rb
