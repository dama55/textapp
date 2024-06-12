# ベースはNode.js
FROM node:22

WORKDIR /usr/src/app/project

COPY ./project/package*.json .
RUN ls -la 
RUN npm install

# COPY ./project . # nodemodulesをコピーしようとして問題が発生した．

EXPOSE 3000

CMD ["npm", "start"]
