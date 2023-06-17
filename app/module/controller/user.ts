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
  userValidateFail: {
    errno: 101001,
    msg: '请求用户接口参数有误',
  },
  createUserAlreadyExist: {
    errno: 101002,
    msg: '该邮箱已经被注册，请直接登录',
  },
  loginCheckFailInfo: {
    errno: 101003,
    msg: '用户不存在或者密码不正确',
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
  validateUserInput(ctx:EggContext, req:UserModelType) {
    // 参数检查
    const errors = ctx.app.validator.validate(userCreatedRule, req);
    return errors;
  }

  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: 'create',
  })
  // @HTTPQuery({ name: 'userId' }) userId: string;
  // @Context() ctx: EggType,
  async createByEmail(@HTTPBody() req:UserModelType, @Context() ctx: EggContext) {
    const errors = this.validateUserInput(ctx, req);
    if (errors) {
      ctx.logger.warn(errors);
      return ctx.helper.error({ errorType: 'userValidateFail', errDetail: errors });
    }
    // 检查用户名是否唯一
    const user = await this.userService.findByUsername(req.username);
    if (user) {
      return ctx.helper.error({ errorType: 'createUserAlreadyExist' });
    }
    // ctx.validate(userCreatedRule);
    const res = await this.userService.createByEmail(req, ctx);

    return ctx.helper.success({ res });
  }
  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: 'login',
  })
  async loginByEmail(@HTTPBody() req:UserModelType, @Context() ctx: EggContext) {
    const errors = this.validateUserInput(ctx, req);
    //  check request param
    if (errors) {
      ctx.logger.warn(errors);
      return ctx.helper.error({ errorType: 'userValidateFail', errDetail: errors });
    }
    // Check whether the user exist
    const { username, password } = req;
    const user = await this.userService.findByUsername(username);
    if (!user) {
      return ctx.helper.error({ errorType: 'loginCheckFailInfo' });
    }
    // check password
    const validatePassword = await ctx.compare(password, user.password);
    if (!validatePassword) {
      ctx.helper.error({ errorType: 'loginCheckFailInfo' });
    }
    ctx.cookies.set('username', user.username, { encrypt: true });
    return ctx.helper.success({ res: user.toJSON(), msg: '登录成功' });


  }
  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: 'query',
  })
  async findById(@HTTPQuery() id: string, @Context() ctx: EggContext) {
    // const { ctx } = this;
    // console.log(ctx.app.genHash);
    console.log(ctx.cookies.get('username'));
    console.log(id);
    // const row = await this.userService.findById(id);
    return ctx.helper.success({ res: ctx.cookies.get('username', { encrypt: true }) });
  }
}
