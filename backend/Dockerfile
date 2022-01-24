FROM node:16.13.1

WORKDIR /

ENV HOST=0.0.0.0

COPY package.json .


RUN npm install -g npm@8.3.2
RUN npm install
RUN apt-get -q update && apt-get -qy install netcat
COPY . .

ENTRYPOINT ["node","server.js"]
