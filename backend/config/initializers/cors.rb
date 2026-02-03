# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Validação dinâmica de origem usando um proc
    # Retorna a string de origem se corresponder aos padrões permitidos (necessário para credentials: true)
    origins do |source, request|
      origin = request.env['HTTP_ORIGIN'] || request.env['Origin']
      
      return nil unless origin
      
      # Verifica primeiro contra a variável de ambiente (para produção)
      if ENV['ALLOWED_ORIGINS'].present?
        allowed = ENV['ALLOWED_ORIGINS'].split(',').map(&:strip)
        return origin if allowed.include?(origin)
      end
      
      # Permite deployments do Vercel (qualquer subdomínio, incluindo previews e branches)
      # Exemplos: https://pa-leva-git-main-lais-projects-5e3ce429.vercel.app
      #          https://paleva.vercel.app
      if origin.include?('.vercel.app')
        return origin
      end
      
      # Permite desenvolvimento local
      if origin.start_with?('http://localhost:')
        return origin
      end
      
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