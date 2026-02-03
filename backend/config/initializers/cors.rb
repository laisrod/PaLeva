# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Validação dinâmica de origem usando um proc
    # Retorna a string de origem se corresponder aos padrões permitidos (necessário para credentials: true)
    origins do |source, request|
      # O rack-cors passa a origem como primeiro parâmetro (source)
      # Se não estiver disponível, obtém do header HTTP_ORIGIN
      origin = source
      origin ||= request.env['HTTP_ORIGIN']
      origin ||= request.env['Origin']
      
      return nil unless origin
      
      # Normaliza a origem
      origin = origin.to_s.strip.chomp('/')
      
      # Verifica primeiro contra a variável de ambiente (para produção)
      if ENV['ALLOWED_ORIGINS'].present?
        allowed = ENV['ALLOWED_ORIGINS'].split(',').map(&:strip).map { |o| o.chomp('/') }
        if allowed.include?(origin)
          Rails.logger.debug "CORS: Origem permitida via ALLOWED_ORIGINS: #{origin}" if defined?(Rails.logger)
          return origin
        end
      end
      
      # Permite deployments do Vercel (qualquer subdomínio, incluindo previews e branches)
      # Exemplos: https://pa-leva-git-main-lais-projects-5e3ce429.vercel.app
      #          https://paleva.vercel.app
      if origin.match?(/^https?:\/\/.*\.vercel\.app/)
        Rails.logger.debug "CORS: Origem Vercel permitida: #{origin}" if defined?(Rails.logger)
        return origin
      end
      
      # Permite desenvolvimento local
      if origin.match?(/^http:\/\/localhost(:\d+)?/)
        Rails.logger.debug "CORS: Origem localhost permitida: #{origin}" if defined?(Rails.logger)
        return origin
      end
      
      Rails.logger.debug "CORS: Origem bloqueada: #{origin}" if defined?(Rails.logger)
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