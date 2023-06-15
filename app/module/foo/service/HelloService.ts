import { EggLogger } from 'egg';
import { SingletonProto, AccessLevel, Inject, ContextProto } from '@eggjs/tegg';
import { Connection, Schema } from 'mongoose';
// import { Schema } from 'mongoose';

@SingletonProto({
  // 如果需要在上层使用，需要把 accessLevel 显示声明为 public
  accessLevel: AccessLevel.PUBLIC,
})
@ContextProto()
export class HelloService {
  // public readonly app: Application;
  // 注入一个 logger
  @Inject()
  mongoose: Connection;
  logger: EggLogger;
  // @EggQualifier(EggType.APP)
  // mongoose: Connection;
  // 封装业务
  async hello(userId: string): Promise<string> {
    const result = { userId, handledBy: 'foo module' };
    this.logger.info('[hello] get result: %j', result);
    return `hello, ${result.userId}`;
  }
  private getPersonModel() {
    const UserSchema = new Schema({
      name: { type: String },
      price: { type: Number },
    }, { collection: 'products' });
    if (!this.mongoose.models.ProductsModel) {
      this.mongoose.model('ProductsModel', UserSchema);
    }
    return this.mongoose.models.ProductsModel;
  }
  async showPerson():Promise<any> {
    const personModel = this.getPersonModel();
    const result = await personModel.find({ price: { $gt: 232 } }).exec();
    return result;
  }
}