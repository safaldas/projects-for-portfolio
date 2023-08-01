###################
# BUILD FOR LOCAL DEVELOPMENT
###################

# Use node:20 for development build
FROM node:20 AS development

# Required for Prisma Client to work in container
RUN apt-get update && apt-get install -y openssl

# Working directory for the NestJS app
WORKDIR /usr/src/app/server

# Copy and install dependencies for the NestJS app
COPY --chown=node:node server/package*.json ./
RUN npm ci

# Copy the entire project directory to both the NestJS and React app working directories
COPY --chown=node:node . .

# Set user to 'node' for running the development server
USER node

###################
# BUILD FOR BUILD
###################

# Use node:20-alpine for production build
FROM node:20-alpine AS build

# Set working directory for the NestJS app
WORKDIR /usr/src/app

# Copy and install dependencies for the NestJS app from the development image
COPY --chown=node:node --from=development /usr/src/app/server/package*.json ./
COPY --chown=node:node --from=development /usr/src/app/server/node_modules ./node_modules

# Build the NestJS app (adjust the command as needed based on your project setup)
COPY --chown=node:node . .
RUN cd server && npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory.
# Passing in --only=production ensures that only the production dependencies are installed.
# This ensures that the node_modules directory is as optimized as possible.
RUN npm ci --only=production && npm cache clean --force

###################
# PRODUCTION
###################
# Use node:20-alpine for production
FROM node:20-alpine As production
# Copy the built NestJS app from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/server/dist ./dist

# Set working directory for the NestJS app in the production image
WORKDIR /usr/src/app

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
