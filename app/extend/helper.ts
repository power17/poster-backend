export const httpErrorMessage = {
  httpStatusError401: {
    errno: 100401,
    msg: '401 Unauthorized响应状态代码表示客户端请求尚未完成，因为它缺少所请求资源的有效身份验证凭据',
  },
};
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
};
const utilErrorMessage = {
  // utils
  uploadByStreamFailInfo: {
    errno: 102009,
    msg: '文件流写入失败',
  },
  uploadOssFailInfo: {
    errno: 102009,
    msg: '上传阿里云存储失败',
  },
  uploadsMultpartFileFialInfo: {
    errno: 102010,
    msg: '多文件上传阿里云存储失败',
  },
  uploadFileFormatFailInfo: {
    errno: 102011,
    msg: '上传文件格式不正确',
  },
  uploadFileSizeLimitFailInfo: {
    errno: 102012,
    msg: '上传文件大小超出限制',
  },
  workNotExitFailInfo: {
    errno: 102013,
    msg: '作品不存在',
  },

};
const workErrorMessage = {
  permissionWorkFail: {
    errno: 103012,
    msg: '权限不足，操作失败',
  },
};
interface RespType {
  res? : any;
  msg? : string
}
const globalErrorMessage = {
  serviceErrorInfo: {
    errno: 101000,
    msg: '后端接口报错',
  },
  inputVaildateFailInfo: {
    errno: 101000,
    msg: '客户端输入参数有误',
  },
  operateFailInfo: {
    errno: 101000,
    msg: '操作失败',
  },
  ...httpErrorMessage,
  ...userErrorMessage,
  ...utilErrorMessage,
  ...workErrorMessage,
};
export type globalErrorMessageType = keyof(typeof globalErrorMessage);
interface ErrorRespType {
  // errno: number;
  // msg?: string;
  errorType: globalErrorMessageType,
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
    const { errno, msg } = globalErrorMessage[errorType];
    return {
      errno,
      msg: msg ? msg : '请求错误',
      errDetail: errDetail ? errDetail : null,
    };
  },
};

