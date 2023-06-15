import { Inject, HTTPController, HTTPMethod, HTTPMethodEnum } from '@eggjs/tegg';
import { HelloService } from '@/module/foo';

@HTTPController({
  path: '/bar',
})
export class UserController {
  @Inject()
  helloService: HelloService;

  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: 'user',
  })
  // @HTTPQuery({ name: 'userId' }) userId: string;
  async user() {

    const res = await this.helloService.showPerson();
    // return await this.helloService.hello(userId);
    return res;
  }
}
