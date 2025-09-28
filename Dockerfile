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

# Expose port 3000 (React default)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]