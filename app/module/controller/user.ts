import { Inject, HTTPController, HTTPMethod, HTTPMethodEnum, EggQualifier, EggType, HTTPBody, Context, EggContext, Middleware } from '@eggjs/tegg';
import { UserService } from '@/module/service';
import { IHelper, EggAppConfig } from 'egg';
import { UserModelType } from 'app/model/user';
import { sign } from 'jsonwebtoken';
import jwt from '../../middleware/jwt';
import { Redis } from 'ioredis';
interface loginQueryParam {
  phoneNumber: string,
  veriCode?: string,
}


// import { EggPlugin } from 'typings/app';
const userCreatedRules = {
  username: 'email',
  password: { type: 'password', min: 8 },
};
const sendCodeRules = {
  phoneNumber: { type: 'string', format: /^1[3-9]\d{9}$/, msg: '手机号码格式错误' },
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
    msg: '登录验证错误',
  },
  sendVeriCodeFrequentlyFailINfo: {
    errno: 101005,
    msg: '发送短信验证码过于频繁',
  },
  veriCodeIncorrectFailInfo: {
    errno: 101006,
    msg: '验证码不正确',
  },
  sendSmsFailInfo: {
    errno: 101007,
    msg: '发送短信验证码失败',
  },


};

@HTTPController({
  path: '/api/users',
})
export class UserController {
  @Inject()
  @EggQualifier(EggType.CONTEXT)
  private helper: IHelper;
  // @Inject()
  // @EggQualifier(EggType.CONTEXT)
  // validate:EggPlugin;
  @Inject()
  private userService: UserService;
  @Inject()
  private redis: Redis;
  @Inject()
  private config: EggAppConfig;
  validateUserInput<T>(ctx:EggContext, req:T, rules: any) {
    // 参数检查
    const errors = ctx.app.validator.validate(rules, req);
    return errors;
  }
  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: 'genVeriCode',
  })
  async sendVerifyCode(@HTTPBody() req: loginQueryParam, @Context() ctx: EggContext) {
    const errors = this.validateUserInput<loginQueryParam>(ctx, req, sendCodeRules);
    if (errors) {

      ctx.logger.warn(errors);
      return ctx.helper.error({ errorType: 'sendVeriCodeFrequentlyFailINfo', errDetail: errors });
    }
    const { phoneNumber } = req;
    const preVeriCode = await this.redis.get(`phoneVeriCode_${phoneNumber}`);
    // 发送过于频繁
    if (preVeriCode) {
      return ctx.helper.error({ errorType: 'sendVeriCodeFrequentlyFailINfo' });
    }
    // [1000,10000)
    const veriCode = (Math.floor(Math.random() * 9000) + 1000).toString();
    // 生产环境发送短信
    if (this.config.env === 'prod') {
      const res = await this.userService.sendSms(phoneNumber, veriCode);
      console.log('短信验证码响应', res);
      if (!res || res && res.body.code !== 'OK') {
        return ctx.helper.error({ errorType: 'sendSmsFailInfo' });
      }
    }

    await this.redis.set(`phoneVeriCode_${phoneNumber}`, veriCode, 'EX', 60);
    return ctx.helper.success({ res: this.config.env === 'local' ? { veriCode } : null, msg: '验证码发送成功' });
  }
  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: 'create',
  })
  async createByEmail(@HTTPBody() req:UserModelType, @Context() ctx: EggContext) {
    const errors = this.validateUserInput(ctx, req, userCreatedRules);
    if (errors) {
      ctx.logger.warn(errors);
      return ctx.helper.error({ errorType: 'userValidateFail', errDetail: errors });
    }
    // 检查用户名是否唯一
    const user = await this.userService.findByOneParam(req.username);
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
    const errors = this.validateUserInput(ctx, req, userCreatedRules);
    //  check request param
    if (errors) {
      ctx.logger.warn(errors);
      return ctx.helper.error({ errorType: 'userValidateFail', errDetail: errors });
    }
    // Check whether the user exist
    const { username, password } = req;
    const user = await this.userService.findByOneParam(username);
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
    const token = sign({ username: user.username }, ctx.app.config.jwt.secret, { expiresIn: 60 * 60 });
    // ctx.cookies.set('username', user.username, { encrypt: true });
    // ctx.session.username = user.username;
    return ctx.helper.success({ res: { token }, msg: '登录成功' });


  }
  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: 'loginByPhone',
  })
  async loginByPhone(@HTTPBody() req:loginQueryParam, @Context() ctx: EggContext) {
    const { veriCode, phoneNumber } = req;
    const veriCodeForRedis = await this.redis.get(`phoneVeriCode_${phoneNumber}`);
    if (veriCode !== veriCodeForRedis) {
      return this.helper.error({ errorType: 'veriCodeIncorrectFailInfo' });
    }
    const token = await this.userService.loginByPhone(phoneNumber);
    return ctx.helper.success({ res: token });

  }

  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: 'getUserInfo',
  })
  @Middleware(jwt)
  async findById(@Context() ctx: EggContext) {
    // const { username } = ctx.session;
    const userData = await this.userService.findByOneParam(ctx.state.user.username);
    return ctx.helper.success({ res: { userData } });
  }
}
