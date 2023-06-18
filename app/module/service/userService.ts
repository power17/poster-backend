import { SingletonProto, AccessLevel, Inject, EggQualifier, EggType, ContextProto, EggContext } from '@eggjs/tegg';
import { UserModelType } from 'app/model/user';
import { sign } from 'jsonwebtoken';
import { MongooseModels } from 'egg';
import { EggAppConfig } from 'typings/app';


// import { Connection } from 'mongoose';
// import { Connection } from 'mongoose';
// import { Schema } from 'mongoose';

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
  async createByEmail(payload: UserModelType, ctx:EggContext) {
    const { username, password } = payload;
    // 加密
    const hash = await ctx.genHash(password);
    const userCreatedData: Partial<UserModelType> = {
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
      const token = sign({ phoneNumber: user.phoneNumber }, this.config.jwt.secret, { expiresIn: 60 * 60 });
      return token;
    }
    const userCreateData: Partial<UserModelType> = {
      phoneNumber,
      username: phoneNumber,
      nickname: `power${phoneNumber.slice(-4)}`,
      type: 'phone',
    };
    const newUser = await this.model.User.create(userCreateData);
    const token = sign({ username: newUser.username }, this.config.jwt.secret, { expiresIn: 60 * 60 });
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
