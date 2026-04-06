# 1. Base Image: Start with an official Node.js image. 
# Using 'alpine' makes the image smaller.
FROM node:18-alpine

# 2. Working Directory: Create and set the working directory inside the container.
WORKDIR /usr/src/app

# 3. Copy package files: Copy package.json and package-lock.json.
# This is done separately to leverage Docker's layer caching.
COPY package*.json ./

# 4. Install Dependencies: Install the project dependencies.
RUN npm install

# 5. Copy Application Code: Copy the rest of your application's source code.
COPY . .

# 6. Expose Port: Let Docker know that the container will listen on this port.
# Make sure this matches the PORT in your .env file (e.g., 5000).
EXPOSE 5000

# 7. Start Command: The command to run when the container starts.
CMD [ "node", "server.js" ]
