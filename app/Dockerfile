# === Build Stage ===
FROM node:18 as builder

WORKDIR /app

COPY package*.json ./
RUN yarn install

# Copy source code
COPY . .  
RUN yarn build  # Or: npm run build

# === Final Stage ===
FROM nginx:alpine

# Remove default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built app from previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]