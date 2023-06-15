
interface Resp {
  res? : any;
  msg? : string
}
// interface commonResType {
//   errno: number;
//   data: Response | null;
//   msg: string
// }
// interface commonSucessType {
//   success: (arg: Resp) => commonResType
// }
export default {
  success({ res, msg }:Resp) {
    return {
      errno: 0,
      data: res ? res : null,
      msg: msg ? msg : '请求成功',
    };
  },
};

