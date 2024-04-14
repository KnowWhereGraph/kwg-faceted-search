FROM amd64/node:lts-buster-slim

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm i
RUN npm install -g @angular/cli

COPY . .
