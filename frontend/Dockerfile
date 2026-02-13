# Dockerfile para desenvolvimento do frontend React/Vite
FROM node:20-slim

# Instalar dependências do sistema
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
    git \
    && rm -rf /var/lib/apt/lists/*

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm install

# Copiar o resto da aplicação
COPY . .

# Expor porta
EXPOSE 5176

# Comando padrão (modo desenvolvimento)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
