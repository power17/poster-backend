import { Inject, HTTPController, HTTPMethod, HTTPMethodEnum, EggQualifier, Context, EggType, EggContext } from '@eggjs/tegg';
import { HelloService } from '@/module/service';
import { IHelper } from 'egg';

@HTTPController({
  path: '/bar',
})
export class UserController {
  @Inject()
  @EggQualifier(EggType.CONTEXT)
  helper: IHelper;
  @Inject()
  helloService: HelloService;


  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: 'user',
  })
  // @HTTPQuery({ name: 'userId' }) userId: string;
  async user(@Context() ctx: EggContext) {
    const res = await this.helloService.showPerson(ctx);
    return this.helper.success({ res, msg: 'fjsdlfjds' });
    // return await this.helloService.hello(userId);
    // return res;
  }
}
