Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Allow all Vercel deployments and other origins
    origins(
      'http://localhost:5176',
      'http://localhost:5177',
      /https?:\/\/.*\.vercel\.app/,
      /https?:\/\/.*\.railway\.app/,
      /https?:\/\/.*\.github\.io/
    )
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      expose: ['Authorization', 'Content-Type'],
      max_age: 86400
  end
end