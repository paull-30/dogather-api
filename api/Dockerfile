FROM alpine:latest

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8800
CMD ["npm","run", "dev"]

# docker build -t my-api-image .
