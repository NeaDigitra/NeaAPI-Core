# Use official Node.js 22 alpine image (lightweight)
FROM node:22-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy all project files into container
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Set default environment variables
ENV NODE_ENV=production
ENV NODE_PATH=src

# Command to start your app
CMD ["node", "src/server.js"]