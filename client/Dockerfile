# Use a Node.js base image
FROM node

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app
RUN npm run build

# Use a lightweight web server to serve the build
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Expose the port
EXPOSE 80
