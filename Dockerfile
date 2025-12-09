# Estágio 1: Instalação das dependências
FROM node:18-alpine AS deps
WORKDIR /app

# Copia os arquivos de dependência (package.json e lockfiles)
COPY package.json package-lock.json* ./

# Instala as dependências (ci é mais rápido e seguro para builds)
RUN npm ci

# Estágio 2: Builder (Compilação do projeto)
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desativa a telemetria do Next.js durante o build (opcional)
ENV NEXT_TELEMETRY_DISABLED 1

# Gera o build de produção
RUN npm run build

# Estágio 3: Runner (Imagem final de produção)
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Cria um usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia apenas os arquivos necessários do build
# Nota: É necessário configurar output: 'standalone' no next.config.js (veja abaixo)
COPY --from=builder /app/public ./public

# Copia o build standalone (otimizado para Docker)
# Se der erro aqui, verifique a configuração do next.config.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# O hostname "0.0.0.0" é necessário para o Docker
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]