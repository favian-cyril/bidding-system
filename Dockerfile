FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG DATABASE_URL
ARG BASE_URL

RUN npm run build
