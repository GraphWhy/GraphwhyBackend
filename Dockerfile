FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY ./package.json /usr/src/app
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Open up the web server port for the app
EXPOSE 3010

# Start the app
CMD [ "npm", "start" ]
