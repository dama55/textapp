FROM node:18

WORKDIR /usr/src/app 

COPY package*.json .

RUN npm install -g npm@latest
RUN npm init -y
RUN npm install express

COPY . .

EXPOSE 5000

CMD ["node", "app.js"]
#CMD ["/bin/bash"]