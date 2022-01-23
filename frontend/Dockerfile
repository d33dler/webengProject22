# Stage 1
FROM node:16.13.1
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install -g npm@8.3.2
RUN npm install @reach/router --legacy-peer-deps
RUN npm install
CMD export NODE_OPTIONS=--openssl-legacy-provider
COPY . .

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

RUN npm start

# Stage 2
FROM nginx:1.18.0-alpine

COPY --from=build-stage /frontend/build /usr/share/nginx/html
EXPOSE $REACT_DOCKER_PORT

CMD nginx -g 'daemon off;'
