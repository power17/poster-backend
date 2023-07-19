import { Context, EggContext, HTTPBody, HTTPController, HTTPMethod, HTTPMethodEnum, HTTPParam, Inject } from '@eggjs/tegg';
import { WorkService } from '../service/workService';
import { WorkProps } from '../../model/work';
import { Application, IHelper } from 'typings/app';
import validate from 'app/decorator/validate';
import checkPremission from 'app/decorator/checkPremission';
import { nanoid } from 'nanoid';
const workRule = {
  title: 'string',
};
export interface IndexCondition {
  pageIndex?: number;
  pageSize?: number;
  select?: string | string[];
  populate?: { path?: string; select?: string } | string;
  customSort?: Record<string, any>;
  find?: Record<string, any>;
}
const ListQueryTypeRules = {
  pageIndex: 'string',
  pageSize: 'string',
  // isTemplate: 'string',
  // title: 'string',
};
const channelCreateRules = {
  name: 'string',
  workId: 'number',
};
const channelUpdateRules = {
  name: 'string',
};
@HTTPController({
  path: '/api/work',
})
export class workController {
  @Inject()
  private workService: WorkService;
  @Inject()
  public validator: Application['validator'];
  @Inject()
  public helper: IHelper;
  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: '/createChannel',
  })
  @validate(channelCreateRules, 'inputVaildateFailInfo')
  @checkPremission({ casl: 'Channel', mongoose: 'Work' }, 'permissionWorkFail', { value: { type: 'body', valueKey: 'workId' } })
  async createChannel(@Context() ctx: EggContext) {
    const { workId, name } = ctx.request.body;
    const newChannel = {
      name,
      id: nanoid(6),
      workId,
    };
    const certainWork = await ctx.model.Work.findOneAndUpdate({ id: workId }, { $push: { channels: newChannel } });
    if (certainWork) {
      return ctx.helper.success({ res: newChannel });
    }
    return ctx.helper.error({ errorType: 'operateFailInfo' });
  }
  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: '/getChannels/:id',
  })
  @checkPremission({ casl: 'Channel', mongoose: 'Work' }, 'permissionWorkFail')
  async getChannel(@Context() ctx: EggContext) {
    const { id } = ctx.params;
    const { channels } = (await ctx.model.Work.findOne({ id })) || {};
    if (!channels) {
      return ctx.helper.error({ errorType: 'operateFailInfo' });
    }
    return ctx.helper.success({ res: { count: channels.length, list: channels } });
  }
  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: '/updateWorkchannel/:id',
  })
  @validate(channelUpdateRules, 'inputVaildateFailInfo')
  @checkPremission({ casl: 'Channel', mongoose: 'Work' }, 'permissionWorkFail', { key: 'channels.id' })
  async updateChannel(@Context() ctx: EggContext) {
    const { id } = ctx.params;
    const { name } = ctx.request.body;
    const res = (await ctx.model.Work.findOneAndUpdate({ 'channels.id': id }, { 'channels.$.name': name }, { new: true })) || {};
    if (!res) {
      return ctx.helper.error({ errorType: 'operateFailInfo' });
    }
    return ctx.helper.success({ res });
  }
  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: '/deleteWorkchannel/:id',
  })
  @checkPremission({ casl: 'Channel', mongoose: 'Work' }, 'permissionWorkFail', { key: 'channels.id' })
  async deleteWorkChannels(@Context() ctx: EggContext) {
    const { id } = ctx.params;
    const work = await ctx.model.Work.findOneAndUpdate({ 'channels.id': id }, { $pull: { channels: { id } } }, { new: true });
    if (!work) {
      return ctx.helper.error({ errorType: 'operateFailInfo' });
    }
    return ctx.helper.success({ res: work });
  }
  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: '/createWork',
  })
  @validate(workRule, 'inputVaildateFailInfo')
  @checkPremission('Work', 'permissionWorkFail')
  async createWork(@Context() ctx: EggContext, @HTTPBody() req: WorkProps) {
    // ctx.app.validator.validate(workRule, req);
    const workData = await this.workService.createWork(req);
    return ctx.helper.success({ res: workData });
  }
  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: '/templates',
  })
  @validate(ListQueryTypeRules, 'inputVaildateFailInfo')
  // @checkPremission('Work', 'permissionWorkFail')
  async queryList(@Context() ctx: EggContext) {
    const { pageIndex, pageSize, isTemplate, title } = ctx.query;
    console.log(ctx.state.user, 'fsfsdfd');
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
  @HTTPMethod({
    method: HTTPMethodEnum.GET,
    path: '/:id',
  })
  @checkPremission('Work', 'permissionWorkFail')
  async getWork(@Context() ctx: EggContext) {
    const { id } = ctx.params;
    const work = await ctx.model.Work.findOne({ id });
    return ctx.helper.success({ res: work });
  }
  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: '/updateWork/:id',
  })
  async updateWork(@Context() ctx: EggContext, @HTTPParam() id: string, @HTTPBody() payload: Partial<WorkProps>) {
    const res = await ctx.model.Work.findOneAndUpdate({ id: Number(id) }, payload, { new: true }).lean();
    ctx.logger.info(res, 'res');
    return ctx.helper.success({ res });
  }
  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: '/deleteWork/:id',
  })
  @checkPremission('Work', 'permissionWorkFail')
  async deleteWork(@Context() ctx: EggContext, @HTTPParam() id: number) {
    const res = await ctx.model.Work.findOneAndDelete({ id: Number(id) })
      .select('id _id title')
      .lean();
    return ctx.helper.success({ res });
  }

  @checkPremission('Work', 'permissionWorkFail', { action: 'publish' })
  async public(ctx: EggContext, isTemplate: boolean) {
    const url = await this.workService.public(Number(ctx.params.id), isTemplate);
    return ctx.helper.success({ res: url });
  }
  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: '/publishWork/:id',
  })
  async publicWork(@Context() ctx: EggContext) {
    const res = await this.public(ctx, false);
    return res;
  }
  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: '/publishTemplate/:id',
  })
  async publicTemplate(@Context() ctx: EggContext) {
    const res = await this.public(ctx, true);
    return res;
  }
}
