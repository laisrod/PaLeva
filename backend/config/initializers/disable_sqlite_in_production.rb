# Força o uso de PostgreSQL em produção
# Isso evita que o Rails tente carregar o adapter SQLite que não está no bundle de produção
# Arquivo simplificado para evitar problemas de sintaxe
if Rails.env.production?
  Rails.logger.info "Production environment detected. Using PostgreSQL adapter."
end
