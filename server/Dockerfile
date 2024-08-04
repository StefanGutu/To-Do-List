# Use Node.js image
FROM node:14

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your code
COPY . .

# Expose the port
EXPOSE 4000

# Start the server
CMD ["npm", "run", "dev"]
