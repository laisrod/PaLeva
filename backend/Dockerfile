# Dockerfile para desenvolvimento do backend Rails
FROM ruby:3.3.4-slim

# Instalar dependências do sistema
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
    build-essential \
    git \
    libvips \
    sqlite3 \
    libsqlite3-dev \
    pkg-config \
    nodejs \
    npm \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Definir diretório de trabalho
WORKDIR /app

# Copiar Gemfile e Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Instalar gems
RUN bundle install

# Copiar package.json e package-lock.json
COPY package.json package-lock.json ./

# Instalar dependências npm
RUN npm install

# Copiar o resto da aplicação
COPY . .

# Expor porta
EXPOSE 3000

# Script de entrada
RUN chmod +x bin/docker-entrypoint
ENTRYPOINT ["./bin/docker-entrypoint"]

# Comando padrão
CMD ["bin/rails", "server", "-b", "0.0.0.0"]
