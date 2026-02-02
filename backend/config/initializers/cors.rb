Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
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
      credentials: true
  end
end