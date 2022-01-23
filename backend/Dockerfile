FROM node:16.13.1

WORKDIR /usr/src/app
COPY package.json .
RUN npm install -g npm@8.3.2
RUN npm install
RUN npm audit fix
COPY . .
RUN npm run server
