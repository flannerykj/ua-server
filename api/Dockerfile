# Urban Applause API
# Version: 1.0

FROM node:8
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 8080
CMD npm run dev
