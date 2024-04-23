FROM node:20.12.2-alpine AS base

# 필요할 때만 의존성 설치
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app

# npm을 사용하여 의존성 설치
COPY package.json package-lock.json ./
RUN npm ci --only=production
RUN rm -rf ./.next/cache

# 필요할 때만 소스 코드 다시 빌드
FROM base AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build

# 프로덕션 이미지, 모든 파일을 복사하고 next 실행
FROM base AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /usr/src/app/public ./public
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]