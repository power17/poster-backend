import { Inject, HTTPController, HTTPMethod, HTTPMethodEnum, EggQualifier, EggType, HTTPBody, HTTPQuery, Context, EggContext } from '@eggjs/tegg';
import { UserService } from '@/module/service';
import { IHelper } from 'egg';
import { UserModelType } from 'app/model/user';
import { sign, verify } from 'jsonwebtoken';


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
  loginValidateFail: {
    errno: 101004,
    msg: '登录验证失败',
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
    // Register claims 注册相关信息
    // public claims 公共信息 should be unique like email, address or phone_number
    // genarate token sign
    const token = sign({ username: user.username }, ctx.app.config.secret, { expiresIn: 60 * 60 });
    // ctx.cookies.set('username', user.username, { encrypt: true });
    // ctx.session.username = user.username;
    return ctx.helper.success({ res: { token }, msg: '登录成功' });


  }
  getTokenValue(ctx:EggContext) {
    const { authorization } = ctx.header;
    if (!authorization && !ctx.header) {
      return false;
    }
    if (typeof authorization === 'string') {
      const parts = authorization.trim().split(' ');
      console.log(parts);
      if (parts.length === 2) {
        if (/^bearer$/i.test(parts[0])) {
          return parts[1];
        }
      }
    }
    return false;

  }
  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: 'query',
  })
  async findById(@HTTPQuery() id: string, @Context() ctx: EggContext) {
    // const { username } = ctx.session;
    console.log(id);
    const token = this.getTokenValue(ctx);
    if (!token) {
      return ctx.helper.error({ errorType: 'loginValidateFail' });
    }
    try {
      const decode = verify(token, ctx.app.config.secret);
      return ctx.helper.success({ res: { decode } });
    } catch (e) {
      return ctx.helper.error({ errorType: 'loginValidateFail' });
    }
    // const row = await this.userService.findById(id);
    // ctx.cookies.get('username', { encrypt: true }) }

  }
}
