Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    env_origins = ENV.fetch('ALLOWED_ORIGINS', '')
                     .split(',')
                     .map { |origin| origin.strip.chomp('/') }
                     .reject(&:empty?)

    # Explicit and predictable CORS origins for API requests.
    # With credentials=true, Access-Control-Allow-Origin cannot be "*".
    origins(
      *env_origins,
      %r{\Ahttps://.*\.vercel\.app\z},
      'http://localhost:5173',
      'http://localhost:5176',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5176'
    )

    resource '/api/v1/*',
      headers: :any,
      methods: %i[get post put patch delete options head],
      credentials: true,
      expose: %w[Authorization Content-Type],
      max_age: 86_400

    # Action Cable endpoint
    resource '/cable',
      headers: :any,
      methods: %i[get post options],
      credentials: true
  end
end