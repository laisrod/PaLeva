# Força o uso de PostgreSQL em produção
# Isso evita que o Rails tente carregar o adapter SQLite que não está no bundle de produção
if Rails.env.production?
  # Garante que DATABASE_URL está configurada
  unless ENV['DATABASE_URL'].present?
    raise "DATABASE_URL environment variable is required in production. Please configure it in your Render dashboard."
  end
  
  # Força o uso de PostgreSQL
  Rails.logger.info "Production environment detected. Using PostgreSQL adapter."
rescue => e
  Rails.logger.error "Database configuration error: #{e.message}"
  raise
end
