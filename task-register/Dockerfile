FROM node:14

WORKDIR /app
RUN apt-get update
RUN apt-get install -y vim

RUN npm i -g serverless

COPY package*.json .
RUN npm i

COPY . ./

EXPOSE 4000
CMD ["npm", "run", "local"]
