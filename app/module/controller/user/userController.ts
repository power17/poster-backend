import { Inject, HTTPController, HTTPMethod, HTTPMethodEnum, EggQualifier, EggType, HTTPBody } from '@eggjs/tegg';
import { UserService } from '@/module/service';
import { IHelper } from 'egg';
import { UserModelType } from 'app/model/user';

@HTTPController({
  path: '/bar',
})
export class UserController {
  @Inject()
  @EggQualifier(EggType.CONTEXT)
  helper: IHelper;
  @Inject()
  UserService: UserService;


  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: 'user',
  })
  // @HTTPQuery({ name: 'userId' }) userId: string;
  // @Context() ctx: EggType,
  async user(@HTTPBody() req:UserModelType) {
    console.log(req);
    // await this.UserService.createByEmail(req);
    // return this.helper.success({ res, msg: 'fjsdlfjds' });
    console.log(this.UserService);
    // return await this.UserService.hello('11');
    // return res;
  }
}
