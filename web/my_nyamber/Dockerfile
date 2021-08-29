FROM node:16-alpine

ENV NODE_ENV=production

WORKDIR /app

ADD challenge/package.json ./
RUN npm install --only=production

ADD challenge/server.js ./
ADD challenge/setup.js  ./
ADD challenge/public    ./public
RUN chmod -R 555 *

ENV flag="CakeCTF{BUG-REPORT-ACCEPTED:Reward=222-Matatabi-Sticks}"
RUN node setup.js
RUN chmod 440 database.db

RUN chown -R root:node /app

USER node