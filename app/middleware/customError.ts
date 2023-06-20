import { EggContext } from '@eggjs/tegg';

export default () => {
  return async (ctx:EggContext, next: () => Promise<any>) => {
    try {
      await next();
    } catch (error) {
      const e = error as any;
      console.log(ctx.path, e.status);
      if (e && e.status === 401) {
        return ctx.helper.error({ errorType: 'loginValidateFail' });
        // 图片格式接口
      } else if (ctx.path === '/api/utils/uploadsMulpartsImg') {
        if (e && e.status === 400) {
          ctx.body = ctx.helper.error({ errorType: 'uploadFileFormatFailInfo' });
          return;
        }
      }
    }

  };
};
