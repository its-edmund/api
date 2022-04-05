FROM node:16

WORKDIR /usr/src/app

COPY yarn.lock ./
COPY package.json ./

RUN yarn install

COPY . .

EXPOSE 8003

CMD [ "node", "index.ts" ]
