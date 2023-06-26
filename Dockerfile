FROM node:18-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# 优化打包
COPY package.json pnpm-lock.yaml /usr/src/app/
RUN npm install pnpm -g
RUN pnpm install 
COPY . /usr/src/app/
RUN npm run tsc
EXPOSE 7001
CMD npx egg-scripts start  --title=egg-server-poster-backend
