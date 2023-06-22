import { EggContext } from '@eggjs/tegg';
import { globalErrorMessageType } from 'app/extend/helper';
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}
// import { Controller } from 'egg';
// 创建工厂函数传入 rules 和 errorType
export default function validateInput(rules: any, errorType: globalErrorMessageType) {
  return function(_prototype, _key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
    //   const that = this as Controller;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const ctx = args[0] as EggContext;
      const input = isEmptyObject(ctx.request.body) ? ctx.query : ctx.request.body;
      const errors = ctx.app.validator.validate(rules, input);
      if (errors) {

        ctx.body = ctx.helper.error({ errorType, errDetail: errors });
        return;
      }
      return await originalMethod.apply(this, args);
    };
  };
}
