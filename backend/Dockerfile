FROM node:16.13.1

WORKDIR /
COPY package.json .
RUN npm install -g npm@8.3.2
RUN npm install
COPY . .
#RUN npm server

ENTRYPOINT ["node","server.js"]
