import { Context, HTTPController, EggContext, HTTPMethodEnum, HTTPMethod, Inject } from '@eggjs/tegg';
import { EggAppConfig, EggLogger } from 'typings/app';
import sharp from 'sharp';

@HTTPController({
  path: '/api/utils',
})
export class UtilController {
  @Inject()
  private config: EggAppConfig;
  @Inject()
  private logger: EggLogger;
  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: 'upload',
  })
  async upload(@Context() ctx:EggContext) {
    const file = ctx.request.files[0];
    const { filepath } = file;
    const imageSharp = sharp(filepath);
    const metadata = await imageSharp.metadata();
    this.logger.info(metadata);

    const url = file.filepath.replace(this.config.baseDir, this.config.baseUrl);
    return ctx.helper.success({ res: url });

  }

}
