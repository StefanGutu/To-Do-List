FROM node:16-alpine AS production


WORKDIR /usr/src/server/data

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]