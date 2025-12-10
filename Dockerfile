# ============================
# 1️⃣ Etapa de build
# ============================
FROM node:20-alpine AS builder

# Cria diretório da aplicação
WORKDIR /app

# Copia apenas arquivos essenciais para instalar dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia todo o restante do projeto
COPY . .

# Build de produção
RUN npm run build


# ============================
# 2️⃣ Etapa final (produção)
# ============================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copia apenas os arquivos necessários para rodar a aplicação
COPY --from=builder /app ./


# Porta exposta
EXPOSE 3000

# Comando para iniciar a aplicação Next.js
CMD ["npm", "start"]
