FROM node:16-alpine

WORKDIR /usr/src/client/data


COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "dev"]