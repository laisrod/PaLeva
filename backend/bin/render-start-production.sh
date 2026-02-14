#!/bin/bash
set -e  # Parar em caso de erro

echo "=========================================="
echo "Render Production Start Script"
echo "=========================================="

# Verificar DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL is not set!"
  exit 1
else
  echo "✅ DATABASE_URL is set: ${DATABASE_URL:0:50}..."
fi

# Verificar RAILS_MASTER_KEY
if [ -z "$RAILS_MASTER_KEY" ]; then
  echo "⚠️  WARNING: RAILS_MASTER_KEY is not set!"
fi

echo "Current directory: $(pwd)"
echo "Listing files:"
ls -la | head -5

echo ""
echo "=========================================="
echo "Step 1: Creating database (if needed)..."
echo "=========================================="
bundle exec rails db:create RAILS_ENV=production 2>&1 || {
  echo "Database may already exist, continuing..."
}

echo ""
echo "=========================================="
echo "Step 2: Running migrations..."
echo "=========================================="
bundle exec rails db:migrate RAILS_ENV=production 2>&1 || {
  echo "❌ ERROR: Migrations failed!"
  echo "Trying db:prepare as fallback..."
  bundle exec rails db:prepare RAILS_ENV=production 2>&1 || {
    echo "❌ ERROR: db:prepare also failed!"
    exit 1
  }
}

echo ""
echo "=========================================="
echo "Step 3: Verifying migrations..."
echo "=========================================="
bundle exec rails db:migrate:status RAILS_ENV=production | head -20

echo ""
echo "=========================================="
echo "Step 4: Checking if users table exists..."
echo "=========================================="
bundle exec rails runner "puts ActiveRecord::Base.connection.table_exists?('users') ? '✅ users table exists' : '❌ users table does NOT exist'" RAILS_ENV=production || {
  echo "❌ ERROR: Could not verify users table!"
  exit 1
}

echo ""
echo "=========================================="
echo "✅ All checks passed! Starting Puma..."
echo "=========================================="
exec bundle exec puma -C config/puma.rb
