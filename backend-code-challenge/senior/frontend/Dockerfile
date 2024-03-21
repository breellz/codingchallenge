# Multistage build (1st stage)
FROM node:14.16-alpine3.11 AS builder

# Create directory
WORKDIR /apolitical/frontend

# Install dependencies (with build toolchain)
COPY package.json ./
COPY yarn.lock ./

RUN yarn install

# Bundle source
COPY public ./public
COPY src ./src

RUN yarn build

# Multistage build (2nd stage)
FROM node:14.16-alpine3.11 AS app

# Create directory
WORKDIR /apolitical/frontend

# Install dependencies (without build toolchain)
COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production

RUN yarn global add serve

# Copy built node modules and binaries without including the toolchain
COPY --from=builder /apolitical/frontend/build build

EXPOSE 5000
CMD ["serve", "-s", "build", "-l", "5000"]
