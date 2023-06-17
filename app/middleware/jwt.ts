import { EggContext } from '@eggjs/tegg';
// import { EggAppConfig } from 'typings/app';
import { verify } from 'jsonwebtoken';
function getTokenValue(ctx:EggContext) {
  const { authorization } = ctx.header;
  if (!authorization && !ctx.header) {
    return false;
  }
  if (typeof authorization === 'string') {
    const parts = authorization.trim().split(' ');
    console.log(parts);
    if (parts.length === 2) {
      if (/^bearer$/i.test(parts[0])) {
        return parts[1];
      }
    }
  }
  return false;

}
export default async (ctx: EggContext, next: () => Promise<any>) => {
  // 从header获取token
  const token = getTokenValue(ctx);
  if (!token) {
    ctx.body = ctx.helper.error({ errorType: 'loginValidateFail' });
    return;
  }
  const { secret } = ctx.app.config.jwt;
  console.log(secret, 'secret');
  if (!secret) {
    throw new Error('secret not privided');
  }
  try {
    const decode = verify(token, secret);
    console.log(decode, 'decode');
    ctx.state.user = decode;
    await next();
  } catch (e) {
    ctx.body = ctx.helper.error({ errorType: 'loginValidateFail' });
    console.error(e);
    return;
  }

};
