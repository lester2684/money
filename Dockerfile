# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.9.0
FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

# Install dependencies (including devDependencies for the build)
COPY my-app/package*.json ./my-app/
COPY api/package*.json ./api/

# Install dev dependencies needed for the build
RUN cd my-app && npm install
RUN cd api && npm install

# Copy the application files after installing dependencies
COPY . .

# Build the frontend (React)
WORKDIR /usr/src/app/my-app
RUN npm run build

# Build the backend (API)
WORKDIR /usr/src/app/api
RUN npm run build

# Expose the port for the backend API
EXPOSE 8080

# Start the backend application
CMD ["npm", "start"]
