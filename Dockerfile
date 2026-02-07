# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build argument for Strapi URL
ARG VITE_STRAPI_URL
ENV VITE_STRAPI_URL=$VITE_STRAPI_URL

# Build the app
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install production dependencies (express)
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

# Copy built assets and server
COPY --from=builder /app/dist ./dist
COPY server.js ./

# Start the app - Railway provides PORT env var
CMD ["node", "server.js"]
