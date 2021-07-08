FROM node:14-alpine

WORKDIR /app
RUN apk update
RUN apk add vim
RUN apk add bash

COPY package*.json ./

RUN npm ci

COPY . ./app
# RUN npm run build

EXPOSE 4000
EXPOSE 9229
CMD ["npm", "run", "local"]
