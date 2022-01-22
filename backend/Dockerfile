FROM node:17.3.1

WORKDIR /backend
COPY package.json .
RUN npm install
COPY . .
CMD npm build