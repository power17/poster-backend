import { Context, EggContext, HTTPController, HTTPMethod, HTTPMethodEnum, Inject } from '@eggjs/tegg';
import { Redis } from 'ioredis';
import { version as AppVersion } from '../../../package.json';
import { createConnection } from 'mongoose';


@HTTPController({
  path: '/',
})
export class IndexController {
  @Inject()
  private redis:Redis;
  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: '/',
  })
  async index(@Context() ctx:EggContext) {
    const { status } = this.redis;
    // const { version } = await createConnection().db.command({ buildInfo: 1 });
    return ctx.helper.success({
      res: {
        redisStatus: status,
        ping: process.env.PING_ENV,
        AppVersion,
        // dbVersion: version,


      },
    });
  }
}
