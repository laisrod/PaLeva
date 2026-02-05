# Força o uso de PostgreSQL em produção
# Isso evita que o Rails tente carregar o adapter SQLite que não está no bundle de produção
if Rails.env.production?
  # Garante que DATABASE_URL está configurada
  unless ENV['DATABASE_URL'].present?
    Rails.logger.warn "WARNING: DATABASE_URL environment variable is not set in production!"
  else
    Rails.logger.info "Production environment detected. Using PostgreSQL adapter."
  end
end
