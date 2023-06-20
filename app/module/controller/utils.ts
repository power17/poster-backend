import { Context, HTTPController, EggContext, HTTPMethodEnum, HTTPMethod, Inject } from '@eggjs/tegg';
import { EggAppConfig, EggLogger, FileStream } from 'typings/app';
import sharp from 'sharp';
import { nanoid } from 'nanoid';
import { extname, join, parse } from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import sendToWormhole from 'stream-wormhole';

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
  // file 模式上传文件
  async upload(@Context() ctx:EggContext) {
    const file = ctx.request.files[0];
    const { filepath } = file;
    const imageSharp = sharp(filepath);
    const metadata = await imageSharp.metadata();
    this.logger.info(metadata);
    let thumbnailUrl = '';
    // 缩略图处理
    if (metadata.width && metadata.width > 300) {
      const { name, ext, dir } = parse(filepath);
      thumbnailUrl = join(dir, `${name}-thumbnail${ext}`);
      await imageSharp.resize({ width: 300 }).toFile(thumbnailUrl);
    }
    thumbnailUrl = thumbnailUrl.replace(this.config.baseDir, this.config.baseUrl);
    const url = file.filepath.replace(this.config.baseDir, this.config.baseUrl);
    return ctx.helper.success({ res: { url, thumbnailUrl } });

  }
  // stream 模式上传文件
  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: '/uploadsByStream',
  })
  async uploadFileByStream(@Context() ctx: EggContext) {

    const stream = await ctx.getFileStream();
    const { ext, name } = parse(stream.filename);
    const uid = nanoid(6);
    const saveFilePath = join(this.config.baseDir, 'uploads', name + uid + ext);
    const saveThumbnailFilePath = join(this.config.baseDir, 'uploads', uid + '_thumbnail' + extname(stream.filename));
    const target = createWriteStream(saveFilePath);
    const thumbnailTarget = createWriteStream(saveThumbnailFilePath);
    const savePromise = pipeline(stream, target);
    const saveThumbnailPromise = pipeline(stream, sharp().resize({ width: 300 }), thumbnailTarget);
    try {
      await Promise.all([ savePromise, saveThumbnailPromise ]);
    } catch (e) {
      ctx.helper.error({ errorType: 'uploadByStreamFailInfo' });
    }
    const thumbnailUrl = saveThumbnailFilePath.replace(this.config.baseDir, this.config.baseUrl);
    const url = saveFilePath.replace(this.config.baseDir, this.config.baseUrl);
    return ctx.helper.success({ res: { thumbnailUrl, url } });


  }
  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: '/uploadsByOss',
  })
  // 流模式上传文件到阿里云
  async uploadstoOssByStream(@Context() ctx:EggContext) {
    const stream = await ctx.getFileStream();
    const { name, ext } = parse(stream.filename);
    const path = join('/poster', name + nanoid(6) + ext);
    try {
      const { name, url } = await ctx.oss.put(path, stream);
      return ctx.helper.success({ res: { name, url } });
    } catch (e) {
      // 关闭流
      await sendToWormhole(stream);
      return ctx.helper.error({ errorType: 'uploadOssFailInfo' });
    }

  }

  @HTTPMethod({
    method: HTTPMethodEnum.POST,
    path: '/uploadsMulpartsFile',
  })
  // 多文件上传阿里云
  async uploadsMulpartsFile(@Context() ctx:EggContext) {
    // 获取数据流
    const parts = ctx.multipart();
    let part: string[] | FileStream;
    const urls: string[] = [];
    while ((part = await parts())) {
      if (Array.isArray(part)) {
        this.logger.info(part);
      } else {
        try {
          const stream = part as FileStream;
          const { name, ext } = parse(stream.filename);
          const path = join('/poster', name + nanoid(6) + ext);
          // 上传
          const { url } = await ctx.oss.put(path, stream);
          urls.push(url);

        } catch (e) {
          await sendToWormhole(part);
          return ctx.helper.error({ errorType: 'uploadsMultpartFileFialInfo' });
        }
      }

    }
    return ctx.helper.success({ res: { urls } });

  }
  // @HTTPMethod({
  //   method: HTTPMethodEnum.POST,
  //   path: '/uploadsFileByOss',
  // })
  // // 单文件上传阿里云
  // async uploadstoOssByFile(@Context() ctx:EggContext) {
  //   const stream = await ctx.getFileStream();
  //   const path = join('/poster', nanoid(6) + extname(stream.filename));
  //   try {
  //     const { name, url } = await ctx.oss.put(path, stream);
  //     return ctx.helper.success({ res: { name, url } });
  //   } catch (e) {
  //     // 关闭流
  //     await sendToWormhole(stream);
  //     return ctx.helper.error({ errorType: 'uploadOssFailInfo' });
  //   }

  // }

}
