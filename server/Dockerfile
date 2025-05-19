FROM node:18-bullseye

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy only dependency-related files first (for better Docker caching)
COPY package.json yarn.lock .yarnrc.yml ./

# Enable corepack to respect "packageManager" field in package.json
RUN corepack enable
RUN corepack prepare yarn@4.9.1 --activate
RUN yarn install

COPY . .

EXPOSE 3000

ENV DATABASE_URL=postgres://postgres:3503@boutique_db:5432/Boutique

RUN yarn build
RUN npx prisma generate

CMD ["yarn", "start"]
