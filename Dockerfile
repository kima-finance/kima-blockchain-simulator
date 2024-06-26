# Base Image
FROM node:18-alpine

# Working Directory
WORKDIR /app

# Copy Dependency List
COPY package*.json ./

# Install Dependencies 
RUN npm install

# Copy Source Code
COPY src ./src
COPY tsconfig.json ./

# Execute the Build Script
RUN npm run build

# Expose the Port
EXPOSE 5000 

# Start the Application (Assuming output in 'dist')
CMD [ "node", "dist/index.js" ] 
