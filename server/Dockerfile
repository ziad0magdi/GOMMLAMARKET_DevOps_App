FROM node

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install


# Copy the rest of the backend code
COPY . .

# Expose port 4001
EXPOSE 8080

# Start the backend server
CMD ["node", "server.js"]
