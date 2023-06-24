
import { globalErrorMessageType } from 'app/extend/helper';
import defineRole from 'app/roles/roles';
import { subject } from '@casl/ability';
import { permittedFieldsOf } from '@casl/ability/extra';
import { difference } from 'lodash';
const caslMethodMapping: Record<string, string> = {
  GET: 'read',
  POST: 'create',
  PATCH: 'update',
  DELETE: 'delete',
};
const fieldOptions = { fieldsFrom: rule => rule.fields || [] };
interface IOptions {
  // 自定义 action
  action?: string;
  // 查找记录时候的 key，默认为 id
  key?: string;
  // 查找记录时候 value 的 来源 默认为 ctx.params
  // 来源于对应的 URL 参数 或者 ctx.request.body, valueKey 数据来源的键值
  value?: { type: 'params' | 'body', valueKey: string }
}
// interface ModelMapping {
//   mongoose: string;
//   casl: string;
// }
/**
 *
 * @param modelName model 的名称，可以是普通的字符串，也可以是 casl 和 mongoose 的映射关系
 * @param errorType 返回的错误类型，来自 GlobalErrorTypes
 * @param option 特殊配置选项，可以自定义 action 以及查询条件，详见上面的 IOptions 选项
 * @return function 函数
 */
export default function checkPermission(modelName: string, errorType: globalErrorMessageType, options?: IOptions) {
  return function(_prototype, _key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      const ctx = args[0];
      const { id } = ctx.params;
      const { method } = ctx.request;
      const action = (options && options.action) ? options.action : caslMethodMapping[method];
      if (!ctx.state || !ctx.state.user) {
        ctx.body = ctx.helper.error({ errorType });
        return;
      }
      // 获取对应的role
      let permission = false;
      let keyPermission = true;
      const ability = defineRole(ctx.state.user);
      // 根据rule是否有权限查询
      const rule = ability.relevantRuleFor(action, modelName);
      console.log(rule, 'rule', ctx.state.user);
      if (rule && rule.conditions) {
        const certainRecord = await ctx.model[modelName].findOne({ id }).lean();
        permission = ability.can(action, subject(modelName, certainRecord));
      } else {
        permission = ability.can(action, modelName);
      }
      // 判断rule是否有受限字段
      if (rule && rule.fields) {
        const fields = permittedFieldsOf(ability, action, modelName, fieldOptions);
        if (fields.length > 0) {
          const payloadKey = Object.keys(ctx.request.body);
          const diffKeys = difference(payloadKey, rule.fields);
          keyPermission = diffKeys.length === 0;

        }
      }
      if (!permission || !keyPermission) {
        ctx.body = ctx.helper.error({ errorType });
        return;
      }
      console.log(permission, 'permission');
      // const userId = ctx.state.user._id;
      // const certainWork = await ctx.model[modelName].findOne({ id });
      // if (!certainWork || certainWork[userKey].toString() !== userId) {
      //   ctx.body = ctx.helper.error({ errorType });
      //   return;
      // }
      return await originalMethod.apply(this, args);
    };
  };
}
