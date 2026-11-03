FROM node:22-alpine
WORKDIR /app
COPY . .
ENV PORT=8080
EXPOSE 8080
VOLUME /app/data
CMD ["node","server.js"]
