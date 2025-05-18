FROM node:18-bullseye

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
