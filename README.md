# hackernews-tegg

[Hacker News](https://news.ycombinator.com/) showcase using [tegg](https://github.com/eggjs/tegg)

## QuickStart

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

Don't tsc compile at development mode, if you had run `tsc` then you need to `npm run clean` before `npm run dev`.

### Deploy

```bash
$ npm run tsc
$ npm start
```

### Npm Scripts

- Use `npm run lint` to check code style
- Use `npm test` to run unit test
- se `npm run clean` to clean compiled js at development mode once

### Requirement

- Node.js >= 16.x
- Typescript >= 4.x

## 启动docker
```bash
# 开启docker
$ docker-compose up -d
# 关闭docker
$ docker-compose down
# 一键清理 Build Cache 缓存命令： 
docker builder prune
```