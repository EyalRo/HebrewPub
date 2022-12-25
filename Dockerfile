# pull official base image
# (alpine is a small linux for containers)
FROM node:alpine

# set working directory
WORKDIR /app

# expose ports
EXPOSE 3000/tcp

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts -g --silent

# add app
COPY . ./

# start app
CMD ["npm", "start"]