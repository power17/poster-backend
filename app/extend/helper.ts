import { userErrorMessage } from '@/module/controller/user';
interface RespType {
  res? : any;
  msg? : string
}
interface ErrorRespType {
  // errno: number;
  // msg?: string;
  errorType: keyof(typeof userErrorMessage),
  errDetail?: any

}
export default {
  success({ res, msg }:RespType) {
    return {
      errno: 0,
      data: res ? res : null,
      msg: msg ? msg : '请求成功',
    };
  },
  error({ errorType, errDetail }: ErrorRespType) {
    const { errno, msg } = userErrorMessage[errorType];
    return {
      errno,
      msg: msg ? msg : '请求错误',
      errDetail: errDetail ? errDetail : null,
    };
  },
};

