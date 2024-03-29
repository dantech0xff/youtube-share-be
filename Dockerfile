FROM node:21-alpine3.18

WORKDIR /app

COPY . .

RUN apk update && apk add bash
RUN apk add --no-cache python3
RUN npm install pm2 -g
RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "prod_gcp"]

