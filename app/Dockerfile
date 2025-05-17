# === Build Stage ===
FROM node:18-bullseye AS builder

# Accept build arg from docker-compose
ARG VITE_API_HOST

# Pass the env var into the Vite build
ENV VITE_API_HOST=$VITE_API_HOST

WORKDIR /app

# Copy only dependency-related files first (for better Docker caching)
COPY package.json yarn.lock .yarnrc.yml ./

# Enable corepack to respect "packageManager" field in package.json
RUN corepack enable
RUN corepack prepare yarn@4.9.1 --activate
RUN yarn install

# Copy source code
COPY . .  
RUN yarn build 

# === Final Stage ===
FROM nginx:alpine

# Remove default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built app from previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]