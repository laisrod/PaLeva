# config/initializers/cors.rb ou application.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*'   # ← temporário só para teste!

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,   # mantenha se usa cookies/sessões
      expose: ['Authorization', 'Content-Type'],
      max_age: 86400
  end
end