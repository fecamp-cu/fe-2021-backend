# Base Image
FROM node:16.13-alpine AS base

# Initialize working directory
WORKDIR /usr/src/app

# Prepare for installing dependencies
COPY ["package.json", "yarn.lock", "./"]

# Install dependencies
RUN yarn --frozen-lockfile

# Set ENV to production
ENV NODE_ENV production

# Build Image
FROM base AS build

# Copy File from source to workdir
COPY . .

# Build application
RUN yarn build

# Back to Base Image
FROM base

# Copy files from Build Image to Base Image
COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY --from=build /usr/src/app/src /usr/src/app/src

# Expose listening port
EXPOSE 8000

# Starting scripts
CMD node dist/main