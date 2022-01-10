# Base Image
FROM node:16.13-alpine AS base

# Initialize working directory
WORKDIR /usr/src/app

# Prepare for installing dependencies
COPY ["package.json", "yarn.lock", "./"]

# Install dependencies
RUN yarn --frozen-lockfile

# Build Image
FROM base AS build

# Copy File from source to workdir
COPY . .

# Build application
RUN yarn build

FROM base as prod-deps

# Prune unused dependencies
RUN npm prune --production

# Back to Base Image
FROM node:16.13-alpine AS production

# Initialize working directory
WORKDIR /usr/src/app

# Set ENV to production
ENV NODE_ENV production

# Copy files from Build Image to Base Image
COPY --from=prod-deps /usr/src/app/package.json ./package.json
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY --from=build /usr/src/app/src /usr/src/app/src

# Expose listening port
EXPOSE 8000

# Starting scripts
CMD yarn typeorm:prod | yarn start:prod