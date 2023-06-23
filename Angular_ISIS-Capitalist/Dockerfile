# build environment
FROM node:18 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
RUN npm install react-scripts@3.4.1 -g --silent
COPY . ./
RUN npm run build
# production environment
FROM nginx:alpine
COPY --from=build /app/dist/angular-isis-capitalist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]