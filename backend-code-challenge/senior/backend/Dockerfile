FROM node:14.16-alpine3.11

# Create app directory
WORKDIR /apolitical/backend

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production

# Bundle app source
COPY . .

EXPOSE 3000
CMD ["yarn", "start"]
