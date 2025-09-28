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

# Expose port 3050
EXPOSE 3050

# Set port for React development server
ENV PORT=3050

# Start the application
CMD ["npm", "start"]