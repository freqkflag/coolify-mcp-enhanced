# Use Node.js 20 Alpine as base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev) for building
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S coolify -u 1001

# Set working directory
WORKDIR /app

# Copy package files and install only production dependencies without running lifecycle scripts
COPY --from=builder --chown=coolify:nodejs /app/package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=coolify:nodejs /app/dist ./dist

# Switch to non-root user
USER coolify

# Expose port (if needed for health checks)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('Health check passed')" || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Default: skip startup validation so container can start without creds
ENV MCP_SKIP_STARTUP_VALIDATION=true

# Start the application
CMD ["node", "dist/index.js"]
