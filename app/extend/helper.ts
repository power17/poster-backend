export const userErrorMessage = {
  userValidateFail: {
    errno: 101001,
    msg: '请求用户接口参数有误',
  },
  createUserAlreadyExist: {
    errno: 101002,
    msg: '该邮箱已经被注册，请直接登录',
  },
  loginCheckFailInfo: {
    errno: 101003,
    msg: '用户不存在或者密码不正确',
  },
  loginValidateFail: {
    errno: 101004,
    msg: '登录验证错误',
  },
  sendVeriCodeFrequentlyFailINfo: {
    errno: 101005,
    msg: '发送短信验证码过于频繁',
  },
  veriCodeIncorrectFailInfo: {
    errno: 101006,
    msg: '验证码不正确',
  },
  sendSmsFailInfo: {
    errno: 101007,
    msg: '发送短信验证码失败',
  },
  giteeLoginFailInfo: {
    errno: 101008,
    msg: 'gitee oauth授权失败',
  },

  // utils
  uploadByStreamFailInfo: {
    errno: 101009,
    msg: '文件流写入失败',
  },
  uploadOssFailInfo: {
    errno: 101009,
    msg: '上传阿里云存储失败',
  },
  uploadsMultpartFileFialInfo: {
    errno: 101010,
    msg: '多文件上传阿里云存储失败',
  },
  uploadFileFormatFailInfo: {
    errno: 101011,
    msg: '上传文件格式不正确',
  },
  uploadFileSizeLimitFailInfo: {
    errno: 101012,
    msg: '上传文件大小超出限制',
  },


};
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

