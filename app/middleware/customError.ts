import { EggContext } from '@eggjs/tegg';

export default () => {
  return async (ctx:EggContext, next: () => Promise<any>) => {
    try {
      await next();
    } catch (error) {
      const e = error as any;
      // console.log(error, 121212121);

      if (e && e.status === 401) {
        ctx.body = ctx.helper.error({ errorType: 'httpStatusError401', errDetail: e.message });
        return;
        // 图片格式接口
      } else if (ctx.path === '/api/utils/uploadsMulpartsImg') {
        if (e && e.status === 400) {
          ctx.body = ctx.helper.error({ errorType: 'uploadFileFormatFailInfo', errDetail: e.message });
          return;
        }
      }
      ctx.body = ctx.helper.error({ errorType: 'serviceErrorInfo', errDetail: e.message });
      return;
    }

  };
};
