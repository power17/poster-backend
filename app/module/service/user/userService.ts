import { SingletonProto, AccessLevel, Inject, EggQualifier, EggType, ContextProto, EggContext } from '@eggjs/tegg';
import { UserModelType } from 'app/model/user';
import { MongooseModels } from 'egg';


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
  model:MongooseModels;
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
  async findByUsername(username: string) {
    const result = await this.model.User.findOne({ username });
    return result;
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
  async hello(userId: string): Promise<string> {
    const result = { userId, handledBy: 'foo module' };
    // this.logger.info('[hello] get result: %j', result);
    return `hello, ${result.userId}`;
  }
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
