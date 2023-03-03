FROM node:16.19.0-alpine3.17
WORKDIR /app
# copy package.json and yarn.lock
COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build
CMD ["yarn", "serve"]
EXPOSE 3000
