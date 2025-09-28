# Use Node.js 16 LTS
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps to handle version conflicts
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the React application for production
RUN npm run build

# Verify build was successful
RUN test -d build || (echo "Build failed - no build directory created" && exit 1)
RUN test -f build/index.html || (echo "Build failed - no index.html found" && exit 1)

# List build contents for verification
RUN ls -la build/

# Install a simple HTTP server to serve static files
RUN npm install -g serve

# Expose port 3050
EXPOSE 3050

# Create a simple health endpoint
RUN echo "OK" > build/health

# Serve the built application on port 3050
CMD ["serve", "-s", "build", "-l", "3050"]