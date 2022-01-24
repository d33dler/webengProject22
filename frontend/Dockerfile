# Stage 1
FROM node:16.13.1 as build-stage
WORKDIR /frontend

COPY package*.json ./
RUN npm install -g npm@8.3.2
RUN npm install @reach/router --legacy-peer-deps
RUN npm install
CMD export NODE_OPTIONS=--openssl-legacy-provider
COPY . .

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

EXPOSE 3000

CMD [ "npm", "start" ]


# Stage 2

