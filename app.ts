import { Application, IBoot } from 'egg';
// import { createConnection } from 'mongoose';
// import assert from 'node:assert';


export default class AppBoot implements IBoot {
  private readonly app: Application;
  constructor(app: Application) {
    this.app = app;
    // const { url } = this.app.config.mongoose;
    // assert(url, '[egg-mongoose] url is required on config');
    // // 数据库连接
    // const db = createConnection(url);
    // db.on('connected', () => {
    //   app.logger.info(`[egg-mongoose] ${url} connect successfully`);
    // });
    // app.mongoose = db;

  }
  configWillLoad() {
    // 加入中间件
    this.app.config.coreMiddleware.unshift('myLogger');
  }
  async willReady(): Promise<void> {
    // let app: Application;
    // console.log('willReady middleware', this.app.config.coreMiddleware);
    //  加载model      app/model/user.ts ==>app.model.User
    // const dir = join(this.app.config.baseDir, 'app/model');
    // this.app.loader.loadToApp(dir, 'model', {
    //   caseStyle: 'upper',
    // });
    // console.log(this.app.model, 'this.app');
    // app.model = this.app.model;

  }
  async didReady(): Promise<void> {
    await this.app.createAnonymousContext();
  }
}
