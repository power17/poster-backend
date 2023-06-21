import { AccessLevel, EggContext, EggQualifier, EggType, Inject, SingletonProto } from '@eggjs/tegg';
import { MongooseModels } from 'egg';
import { Types } from 'mongoose';
import { nanoid } from 'nanoid';
import { WorkProps } from '../../model/work';
import { IndexCondition } from '../controller/work';
const defaultIndexCondition: Required<IndexCondition> = {
  pageIndex: 0,
  pageSize: 10,
  select: '',
  populate: '',
  customSort: { createdAt: -1 },
  find: {},
};
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
  async queryList(condition: IndexCondition) {
    const fCondition = {
      ...defaultIndexCondition,
      ...condition,
    };
    const { pageIndex, pageSize, select, populate, customSort, find } = fCondition;
    const skip = pageIndex * pageSize;
    const list = await this.model.Work
      .find(find).select(select).populate(populate)
      .skip(skip)
      .limit(pageSize)
      .sort(customSort)
      .lean();
    const count = await this.model.Work.find(find).count;
    return { count, pageIndex, pageSize, list };


  }

}
