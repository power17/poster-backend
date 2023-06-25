FROM node:18
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install pnpm -g
RUN pnpm install 
RUN npm run tsc
EXPOSE 7001
CMD npx egg-scripts start  --title=egg-server-poster-backend
