FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --cache /tmp/npm-cache

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]

