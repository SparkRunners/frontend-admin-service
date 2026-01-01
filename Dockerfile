# Development image
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Install dependencies
RUN npm install

# Expose Vite dev server port
EXPOSE 5173

# Start development server with hot reload for persistent changes
CMD ["npm", "run", "dev", "--", "--host"]