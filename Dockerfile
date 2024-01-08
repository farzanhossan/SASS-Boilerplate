FROM node:18-alpine
    
WORKDIR /app

COPY . .

RUN yarn
RUN yarn build

EXPOSE 4444

RUN ["chmod", "+x", "./entrypoint.sh"]

ENTRYPOINT [ "sh", "./entrypoint.sh" ]