FROM node:18-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy the entire workspace configuration and lockfiles
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy all packages and apps to get the full context
COPY packages ./packages
COPY apps ./apps

# Install all dependencies based on lockfile
RUN pnpm install --frozen-lockfile

# Generate Prisma Client specifically for the Alpine OS
RUN pnpm --filter @ekene/db generate

# Pass build-time variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BACKEND_API_URL
ENV NEXT_PUBLIC_BACKEND_API_URL=$NEXT_PUBLIC_BACKEND_API_URL
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# Build the web app and its dependencies
RUN pnpm --filter @ekene/web build

FROM node:18-alpine AS runner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app /app

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["pnpm", "--filter", "@ekene/web", "start"]
