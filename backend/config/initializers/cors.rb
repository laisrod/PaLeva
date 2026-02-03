# config/initializers/cors.rb
# Be sure to restart your server when you modify this file.

# Garante que o CORS seja carregado antes de qualquer outro middleware
# Usa insert_before 0 para garantir que seja o primeiro middleware
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Permite origens do Vercel, localhost e origens definidas em ALLOWED_ORIGINS
    origins do |source, request|
      # O rack-cors passa a origem como primeiro parâmetro (source)
      # Para requisições OPTIONS (preflight), pode vir vazio, então pegamos do header
      origin = source
      
      # Se source estiver vazio ou nil, tenta obter dos headers
      # O Render pode passar a origem de forma diferente
      if origin.nil? || origin.to_s.empty?
        origin = request.env['HTTP_ORIGIN'] || 
                 request.env['Origin'] || 
                 request.env['ORIGIN'] ||
                 request.env['HTTP_X_FORWARDED_HOST'] # Alguns proxies usam isso
      end
      
      return nil if origin.nil? || origin.to_s.empty?
      
      origin = origin.to_s.strip.chomp('/')
      
      # Log para debug - importante para verificar se está sendo chamado
      Rails.logger.info "[CORS] Verificando origem: #{origin}" if defined?(Rails.logger)
      
      # Verifica origens definidas na variável de ambiente primeiro
      if ENV['ALLOWED_ORIGINS'].present?
        allowed = ENV['ALLOWED_ORIGINS'].split(',').map(&:strip).map { |o| o.chomp('/') }
        if allowed.include?(origin)
          Rails.logger.info "[CORS] ✓ Permitida via ALLOWED_ORIGINS: #{origin}" if defined?(Rails.logger)
          return origin
        end
      end
      
      # Permite qualquer URL do Vercel (qualquer subdomínio, incluindo previews)
      # Verifica tanto com http quanto https
      if origin.match?(/^https?:\/\/.*\.vercel\.app/)
        Rails.logger.info "[CORS] ✓ Origem Vercel permitida: #{origin}" if defined?(Rails.logger)
        return origin
      end
      
      # Permite localhost para desenvolvimento
      if origin.match?(/^http:\/\/localhost(:\d+)?/) || origin.match?(/^http:\/\/127\.0\.0\.1(:\d+)?/)
        Rails.logger.info "[CORS] ✓ Origem localhost permitida: #{origin}" if defined?(Rails.logger)
        return origin
      end
      
      Rails.logger.warn "[CORS] ✗ Origem bloqueada: #{origin}" if defined?(Rails.logger)
      nil
    end

    resource '/api/*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      expose: ['Authorization', 'Content-Type'],
      max_age: 86400
  end
end

# Log para confirmar que o initializer foi carregado
# Usa puts para garantir que apareça mesmo se o logger não estiver pronto
puts "[CORS] Initializer carregado com sucesso"
Rails.logger.info "[CORS] Initializer carregado com sucesso" if defined?(Rails.logger)