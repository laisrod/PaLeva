# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Permite origens do Vercel, localhost e origens definidas em ALLOWED_ORIGINS
    origins do |source, request|
      # O rack-cors passa a origem como primeiro parâmetro (source)
      # Para requisições OPTIONS (preflight), pode vir vazio, então pegamos do header
      origin = source
      origin ||= request.env['HTTP_ORIGIN']
      origin ||= request.env['Origin']
      
      return nil if origin.nil? || origin.to_s.empty?
      
      origin = origin.to_s.strip
      
      # Log para debug
      Rails.logger.info "[CORS] Verificando origem: #{origin}" if defined?(Rails.logger)
      
      # Verifica origens definidas na variável de ambiente primeiro
      if ENV['ALLOWED_ORIGINS'].present?
        allowed = ENV['ALLOWED_ORIGINS'].split(',').map(&:strip)
        if allowed.include?(origin)
          Rails.logger.info "[CORS] ✓ Permitida via ALLOWED_ORIGINS: #{origin}" if defined?(Rails.logger)
          return origin
        end
      end
      
      # Permite qualquer URL do Vercel (qualquer subdomínio, incluindo previews)
      if origin.include?('.vercel.app')
        Rails.logger.info "[CORS] ✓ Origem Vercel permitida: #{origin}" if defined?(Rails.logger)
        return origin
      end
      
      # Permite localhost para desenvolvimento
      if origin.start_with?('http://localhost') || origin.start_with?('http://127.0.0.1')
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