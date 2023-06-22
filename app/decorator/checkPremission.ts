
import { globalErrorMessageType } from 'app/extend/helper';
export default function checkPermission(modelName: string, errorType: globalErrorMessageType, userKey = 'user') {
  return function(_prototype, _key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      const ctx = args[0];
      const { id } = ctx.params;
      const userId = ctx.state.user._id;
      const certainWork = await ctx.model[modelName].findOne({ id });
      if (!certainWork || certainWork[userKey].toString() !== userId) {
        ctx.body = ctx.helper.error({ errorType });
        return;
      }
      return await originalMethod.apply(this, args);
    };
  };
}
