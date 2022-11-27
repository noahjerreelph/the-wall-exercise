FROM node


RUN mkdir -p /var/www/the-wall

WORKDIR /var/www/the-wall

COPY web-backend/package.json .

RUN npm install

COPY . .

EXPOSE 1500