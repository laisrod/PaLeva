Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins do |source, request|
      origin = source
      
      if origin.nil? || origin.to_s.empty?
        origin = request.env['HTTP_ORIGIN'] || 
                 request.env['Origin'] || 
                 request.env['ORIGIN'] ||
                 request.env['HTTP_X_FORWARDED_HOST'] # Alguns proxies usam isso
      end
      
      next nil if origin.nil? || origin.to_s.empty?
      
      origin = origin.to_s.strip.chomp('/')
      
      Rails.logger.info "[CORS] Verificando origem: #{origin}" if defined?(Rails.logger)
      
      if ENV['ALLOWED_ORIGINS'].present?
        allowed = ENV['ALLOWED_ORIGINS'].split(',').map(&:strip).map { |o| o.chomp('/') }
        if allowed.include?(origin)
          Rails.logger.info "[CORS] ✓ Permitida via ALLOWED_ORIGINS: #{origin}" if defined?(Rails.logger)
          next origin
        end
      end
      
      if origin.match?(/^https?:\/\/.*\.vercel\.app/)
        Rails.logger.info "[CORS] ✓ Origem Vercel permitida: #{origin}" if defined?(Rails.logger)
        next origin
      end
      
      if origin.match?(/^http:\/\/localhost(:\d+)?/) || origin.match?(/^http:\/\/127\.0\.0\.1(:\d+)?/)
        Rails.logger.info "[CORS] ✓ Origem localhost permitida: #{origin}" if defined?(Rails.logger)
        next origin
      end
      
      Rails.logger.warn "[CORS] ✗ Origem bloqueada: #{origin}" if defined?(Rails.logger)
      nil
    end

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      expose: ['Authorization', 'Content-Type'],
      max_age: 86400
    
    # Permitir WebSocket connections (ActionCable)
    resource '/cable',
      headers: :any,
      methods: [:get, :post, :options],
      credentials: true
  end
end

puts "[CORS] Initializer carregado com sucesso"
Rails.logger.info "[CORS] Initializer carregado com sucesso" if defined?(Rails.logger)