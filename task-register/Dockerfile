FROM node:14-alpine

WORKDIR /app
RUN apk update
RUN apk add vim

RUN npm i -g serverless

COPY package*.json .
RUN npm i

COPY . ./

EXPOSE 4000
CMD ["npm", "run", "local"]
