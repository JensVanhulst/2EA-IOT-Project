FROM node:12-alpine

COPY . .

ENV WAIT_VERSION 2.7.3

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait

RUN chmod +x /wait

RUN npm install

RUN npm i -g pm2

CMD /wait && pm2-runtime start ecosystem.config.js
