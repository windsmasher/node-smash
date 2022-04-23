FROM node:16-slim
WORKDIR /server
COPY package*.json ./
RUN npm install --production
EXPOSE 8000
CMD ["npm", "start"]