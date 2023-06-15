import { Application, IBoot } from 'egg';
import { createConnection } from 'mongoose';
import assert from 'node:assert';

export default class AppBoot implements IBoot {
  private readonly app: Application;
  constructor(app: Application) {
    this.app = app;
    const { url } = this.app.config.mongoose;
    assert(url, '[egg-mongoose] url is required on config');
    // 数据库连接
    const db = createConnection(url);
    db.on('connected', () => {
      app.logger.info(`[egg-mongoose] ${url} connect successfully`);
    });
    app.mongoose = db;

  }
  configWillLoad() {
    this.app.config.coreMiddleware.unshift('myLogger');
  }
  async willReady(): Promise<void> {
    console.log('willReady middleware', this.app.config.coreMiddleware);

  }
}
