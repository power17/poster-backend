import { SingletonProto, AccessLevel, Inject, EggQualifier, EggType, ContextProto, EggContext } from '@eggjs/tegg';
import { UserModelType } from 'app/model/user';
// import { sign } from 'jsonwebtoken';
import { MongooseModels } from 'egg';
import { EggAppConfig } from 'typings/app';
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import Util, * as $Util from '@alicloud/tea-util';

interface loginInfoType {
  'id': string,
  'login': string,
  'name': string,
  'avatar_url': string,
  'url': string,
  'email': string,

}

@SingletonProto({
  // 如果需要在上层使用，需要把 accessLevel 显示声明为 public
  accessLevel: AccessLevel.PUBLIC,
})
@ContextProto()
export class UserService {
  @Inject()
  @EggQualifier(EggType.CONTEXT)
  private model:MongooseModels;
  @Inject()
  private config: EggAppConfig;
  @Inject()
  private aliClient: Dysmsapi20170525;
  @Inject()
  private jwt: any;
  async createByEmail(payload: UserModelType, ctx:EggContext) {
    const { username, password } = payload;
    // 加密
    const hash = await ctx.genHash(password);
    const userCreatedData: Partial<UserModelType> = {
      type: 'email',
      username,
      password: hash,
      email: username,
    };
    return this.model.User.create(userCreatedData);
  }
  async findById(id: string) {
    // user模型
    const result = await this.model.User.findById(id);
    return result;
  }
  async findByOneParam(param: string) {
    const result = await this.model.User.findOne({ username: param });
    return result;
  }
  async loginByPhone(phoneNumber: string) {
    const user = await this.findByOneParam(phoneNumber);
    if (user) {
      // const token = 'fsdf';
      const token = this.jwt.sign({ username: user.phoneNumber, _id: user._id }, this.config.jwt.secret, { expiresIn: 60 * 60 });
      return token;
    }
    const userCreateData: Partial<UserModelType> = {
      phoneNumber,
      username: phoneNumber,
      nickname: `power${phoneNumber.slice(-4)}`,
      type: 'phone',
    };
    const newUser = await this.model.User.create(userCreateData);
    const token = this.jwt.sign({ username: newUser.username, _id: newUser._id }, this.config.jwt.secret, { expiresIn: 60 * 60 });
    return token;
  }
  async sendSms(phoneNumber:string, veriCode:string) {
    const sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
      phoneNumbers: phoneNumber,
      signName: '海报设计系统',
      templateCode: 'SMS_461410693',
      templateParam: `{\"code\":\"${veriCode}\"}`,
    });
    const runtime = new $Util.RuntimeOptions({ });
    try {
      // 复制代码运行请自行打印 API 的返回值
      const res = await this.aliClient.sendSmsWithOptions(sendSmsRequest, runtime);
      return res;
    } catch (error:any) {
      // 如有需要，请打印 error
      Util.assertAsString(error.message);
    }
  }
  async getAccessToken(ctx: EggContext, code: string) {
    const { cid, secret, redirectURL, authUrl } = this.config.giteeOauthConfig;
    const res = await ctx.curl(authUrl, {
      method: 'POST',
      contentType: 'json',
      dataType: 'json',
      data: {
        code,
        client_id: cid,
        client_secret: secret,
        redirect_uri: redirectURL,
        grant_type: 'authorization_code',

      },
    });
    ctx.app.logger.info(res.data.access_token);
    return res.data.access_token;
  }
  async getGiteeUserInfo(ctx: EggContext, token: string) {
    const { data } = await ctx.curl<loginInfoType>(`${this.config.giteeOauthConfig.giteeUserInfo}?access_token=${token}`, {
      dataType: 'json',
    });
    return data;
  }
  async loginByGitee(ctx: EggContext, code: string) {
    const accessToken = await this.getAccessToken(ctx, code);
    const userInfo = await this.getGiteeUserInfo(ctx, accessToken);
    const { id, name, avatar_url, email } = userInfo;
    const stringId = id.toString();
    const existUser = await this.findByOneParam(`gitee#${stringId}`);
    if (existUser) {
      const token = this.jwt.sign({ username: existUser.username, _id: existUser._id }, this.config.jwt.secret, { expiresIn: 60 * 60 });
      return token;
    }
    // 假如不存在
    const userCreateData:Partial<UserModelType> = {
      oauthId: stringId,
      provider: 'gitee',
      username: `gitee#${stringId}`,
      email,
      nickname: name,
      type: 'oauth',
      picture: avatar_url,
    };
    const newUser = await this.model.User.create(userCreateData);
    const token = this.jwt.sign({ username: newUser.username, _id: newUser._id }, this.config.jwt.secret, { expiresIn: 60 * 60 });
    return token;
  }


  // constructor(ctx: Context) {
  //   super(ctx);
  // }
  // @Inject()
  // protected readonly config: EggAppConfig;
  // 注入一个 logger
  // @Inject()
  // mongoose: Connection;

  // logger: EggLogger;
  // @EggQualifier(EggType.APP)
  // mongoose: Connection;
  // 封装业务

  // private getPersonModel() {
  //   const UserSchema = new Schema({
  //     name: { type: String },
  //     price: { type: Number },
  //   }, { collection: 'products' });
  //   if (!this.mongoose.models.ProductsModel) {
  //     this.mongoose.model('ProductsModel', UserSchema);
  //   }
  //   return this.mongoose.models.ProductsModel;
  // }
  async showPerson() {
    // const personModel = this.getPersonModel();
    // console.log(this.model);
    const result = await this.model.User.find({ price: { $gt: 232 } }).exec();
    return result;
    // return 'fdsf';
  }
}
