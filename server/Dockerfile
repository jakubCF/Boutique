FROM node:18-bullseye

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn

COPY . .

EXPOSE 3000

ENV DATABASE_URL=postgres://postgres:3503@boutique_db:5432/Boutique

RUN yarn build
RUN npx prisma generate

CMD ["yarn", "start"]
