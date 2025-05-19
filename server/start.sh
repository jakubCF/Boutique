#!/bin/sh

echo "Pushing Prisma schema..."
npx prisma db push

echo "Applying trigger SQL..."
psql "${DATABASE_URL%%\?*}" -f src/db/create_trigger.sql

echo "Starting app..."
yarn start