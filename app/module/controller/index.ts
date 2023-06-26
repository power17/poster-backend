import { Context, EggContext, HTTPController, HTTPMethod, HTTPMethodEnum, Inject } from '@eggjs/tegg';
import { Redis } from 'ioredis';
import { version as AppVersion } from '../../../package.json';

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
    return ctx.helper.success({
      res: {
        redisStatus: status,
        ping: process.env.PING_ENV,
        AppVersion,
        hello: 'sfdf',
      },
    });
  }
}
