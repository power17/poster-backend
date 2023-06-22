import { Context, EggContext, HTTPBody, HTTPController, HTTPMethod, HTTPMethodEnum, HTTPParam, Inject } from '@eggjs/tegg';
import { WorkService } from '../service/workService';
import { WorkProps } from '../../model/work';
import { Application, IHelper } from 'typings/app';
import validate from 'app/decorator/validate';
const workRule = {
  title: 'string',
};
export interface IndexCondition {
  pageIndex?: number;
  pageSize?: number;
  select?: string | string[];
  populate?: { path?: string; select?: string; } | string;
  customSort?: Record<string, any>;
  find?: Record<string, any>;
}
const ListQueryTypeRules = {
  pageIndex: 'string',
  pageSize: 'string',
  // isTemplate: 'string',
  // title: 'string',
};
// interface ListQueryType {
//   pageIndex: string,
//   pageSize: string,
//   isTemplate?: string,
//   title?:string
// }
@HTTPController({
  path: '/api/work',
})
export class workController {
  @Inject()
  private workService: WorkService;
  @Inject()
  public validator: Application['validator'];
  @Inject()
  public helper:IHelper;
  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: '/createWork',
  })
  @validate(workRule, 'inputVaildateFailInfo')
  async createWork(@Context() ctx:EggContext, @HTTPBody() req: WorkProps) {
    // ctx.app.validator.validate(workRule, req);
    const workData = await this.workService.createWork(req);
    return ctx.helper.success({ res: workData });
  }
  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: '/queryList',
  })
  @validate(ListQueryTypeRules, 'inputVaildateFailInfo')
  async queryList(@Context() ctx:EggContext) {
    const { pageIndex, pageSize, isTemplate, title } = ctx.query;
    const userId = ctx.state.user._id;
    const findConditon = {
      user: userId,
      // 模糊查找 titile
      ...(title && { title: { $regex: title, $options: 'i' } }),
      ...(isTemplate && { isTemplate: !!parseInt(isTemplate) }),
    };
    const listCondition: IndexCondition = {
      select: 'id author copiedCount coverImg desc title user isHot createdAt',
      populate: { path: 'user', select: 'username nickName picture' },
      find: findConditon,
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
      ...(pageSize && { pageSize: parseInt(pageSize) }),
    };
    const res = await this.workService.queryList(listCondition);
    return ctx.helper.success({ res });
  }
  async checkPremission(ctx:EggContext, id:number) {
    try {
      const userId = ctx.state.user._id;

      const certainWork = await ctx.model.Work.findOne({ id });

      if (!certainWork) { return false; }
      ctx.logger.info(certainWork.user.toString() === userId, typeof userId);
      return certainWork.user.toString() === userId;
    } catch (e) {
      ctx.logger.error(e);
    }
  }
  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: '/updateWork/:id',
  })
  async updateWork(@Context() ctx:EggContext, @HTTPParam() id: string, @HTTPBody() payload:Partial<WorkProps>) {
    const permission = await this.checkPremission(ctx, Number(id));
    ctx.logger.info(permission);
    if (!permission) {
      return ctx.helper.error({ errorType: 'pressisonUpdateWorkFail' });
    }
    const res = await ctx.model.Work.findOneAndUpdate({ id: Number(id) }, payload, { new: true }).lean();
    ctx.logger.info(res, 'res');
    return ctx.helper.success({ res });
  }
  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: '/deleteWork/:id',
  })
  async deleteWork(@Context() ctx:EggContext, @HTTPParam() id: number) {
    const permission = this.checkPremission(ctx, Number(id));
    if (!permission) {
      return ctx.helper.error({ errorType: 'pressisonUpdateWorkFail' });
    }
    const res = await ctx.model.Work.findOneAndDelete({ id: Number(id) }).select('id _id title').lean();
    return ctx.helper.success({ res });
  }

}
