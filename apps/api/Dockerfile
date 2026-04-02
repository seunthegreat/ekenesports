FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy the entire workspace configuration and lockfiles
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy all packages and apps to get the full context for pnpm link/workspaces
COPY packages ./packages
COPY apps ./apps

# Install all dependencies based on lockfile
RUN pnpm install --frozen-lockfile

# Generate Prisma Client specifically for the Alpine OS
RUN pnpm --filter @ekene/db generate

# Build the api package and its internal dependencies (like shared, auth, trpc)
RUN pnpm --filter @ekene/api build

FROM node:18-alpine AS runner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy node_modules and built code from builder
COPY --from=builder /app /app

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Run the api in production mode.
CMD ["pnpm", "--filter", "@ekene/api", "start:prod"]
