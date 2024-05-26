# Use an official Node.js runtime as a parent image
FROM node:16

# Install cron
RUN apt-get update && apt-get install -y cron

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Add crontab file to the cron directory
ADD crontab /etc/cron.d/app-cron

# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/app-cron

# Apply cron job
RUN crontab /etc/cron.d/app-cron

# Create the log file to be able to run tail
RUN touch /var/log/cron.log

# Run the command on container startup
CMD node index.js >> /var/log/cron.log 2>&1 && cron && tail -f /var/log/cron.log
