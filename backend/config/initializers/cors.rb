# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Allow Vercel deployments and local development
    # Using a proc to dynamically check origins (required when credentials: true)
    origins do |source, request|
      origin = request.env['HTTP_ORIGIN']
      return false unless origin
      
      # Allow Vercel deployments (any subdomain)
      return true if origin.match?(/https?:\/\/.*\.vercel\.app/)
      
      # Allow local development
      return true if origin.match?(/http:\/\/localhost:\d+/)
      
      false
    end

    resource '/api/*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      expose: ['Authorization', 'Content-Type'],
      max_age: 86400
  end
end