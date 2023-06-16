import { Inject, HTTPController, HTTPMethod, HTTPMethodEnum, EggQualifier, EggType, HTTPBody, HTTPQuery, Context, EggContext } from '@eggjs/tegg';
import { UserService } from '@/module/service';
import { IHelper } from 'egg';
import { UserModelType } from 'app/model/user';

// import { EggPlugin } from 'typings/app';
const userCreatedRule = {
  username: 'email',
  password: { type: 'password', min: 8 },
};
export const userErrorMessage = {
  CreateUserValidateFail: {
    errno: 101001,
    msg: '请求用户创建接口参数有误',
  },
};

@HTTPController({
  path: '/api/users',
})
export class UserController {
  @Inject()
  @EggQualifier(EggType.CONTEXT)
  helper: IHelper;
  // @Inject()
  // @EggQualifier(EggType.CONTEXT)
  // validate:EggPlugin;
  @Inject()
  userService: UserService;


  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: 'create',
  })
  // @HTTPQuery({ name: 'userId' }) userId: string;
  // @Context() ctx: EggType,
  async createByEmail(@HTTPBody() req:UserModelType, @Context() ctx: EggContext) {
    const errors = ctx.app.validator.validate(userCreatedRule, req);
    ctx.logger.warn(errors);
    if (errors) {
      return ctx.helper.error({ errorType: 'CreateUserValidateFail', errDetail: errors });
    }
    // ctx.validate(userCreatedRule);
    ctx.validate(userCreatedRule);
    // ctx.validate(userCreatedRule);
    const res = await this.userService.createByEmail(req);
    return this.helper.success({ res });
  }
  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: 'query',
  })
  async findById(@HTTPQuery() id: string) {
    return this.userService.findById(id);
  }
}
