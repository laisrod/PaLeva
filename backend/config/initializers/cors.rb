Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Para debug: teste com '*' primeiro
    # origins '*'

    origins(
      'http://localhost:5176',
      'http://localhost:5177',
      /\Ahttps?:\/\/[a-z0-9-]+(?:-[a-z0-9-]+)*\.vercel\.app\z/i,  # case insensitive, cobre todos previews
      'https://pa-leva-git-main-lais-projects-5e3ce429.vercel.app'  # adicione o exato se souber
    )

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      expose: ['Authorization'],
      max_age: 86400
  end
end