import { EggLogger } from 'egg';
import { Inject, HTTPController, HTTPMethod, HTTPMethodEnum } from '@eggjs/tegg';
import { HelloService } from '@/module/service';
@HTTPController({
  path: '/',
})
export class HomeController {

  @Inject()
  logger: EggLogger;
  helloService: HelloService;

  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: '/',
  })

  async index() {
    this.logger.info('hello egg logger');
    // const res = await this.helloService.showPerson();
    // return res;
    return 'nofsdnf';
  }
}
