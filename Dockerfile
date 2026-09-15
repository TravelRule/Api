FROM node:20-alpine

WORKDIR /app

# @travel-rule/schema is installed straight from GitHub (see package.json),
# so this build just needs network access during `npm install` — no sibling
# repo or special build context required.

COPY package.json ./
RUN npm install --omit=dev

COPY src ./src

EXPOSE 4200
CMD ["node", "src/index.js"]
