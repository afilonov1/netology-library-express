FROM node:20.4.0

WORKDIR /app

ARG NODE_ENV=PRODUCTION
COPY package*.json .
RUN npm install
COPY . .

CMD ["npm",  "run", "start"]
