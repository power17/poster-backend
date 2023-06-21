import { AccessLevel, EggContext, EggQualifier, EggType, Inject, SingletonProto } from '@eggjs/tegg';
import { MongooseModels } from 'egg';
import { Types } from 'mongoose';
import { nanoid } from 'nanoid';
import { WorkProps } from '../../model/work';
@SingletonProto({
  // 如果需要在上层使用，需要把 accessLevel 显示声明为 public
  accessLevel: AccessLevel.PUBLIC,
})

export class WorkService {
  @Inject()
  @EggQualifier(EggType.CONTEXT)
  private model:MongooseModels;
  @Inject()
  @EggQualifier(EggType.CONTEXT)
  private state:EggContext['state'];
  async createWork(payload) {
    console.log(this.state.id);
    const { username, _id } = this.state.user;
    const uuid = nanoid(6);
    const newEmptyWork: Partial<WorkProps> = {
      ...payload,
      user: Types.ObjectId(_id),
      author: username,
      uuid,
    };
    return this.model.Work.create(newEmptyWork);

  }

}
