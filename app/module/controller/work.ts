import { Context, EggContext, HTTPBody, HTTPController, HTTPMethod, HTTPMethodEnum, Inject } from '@eggjs/tegg';
import { WorkService } from '../service/workService';
import { WorkProps } from '../../model/work';

@HTTPController({
  path: '/api/work',
})

export class workController {
  @Inject()
  private workService: WorkService;
  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: '/createWork',
  })
  async createWork(@HTTPBody() req: WorkProps, @Context() ctx: EggContext) {
    const workData = await this.workService.createWork(req);
    return ctx.helper.success({ res: workData });
  }

}
