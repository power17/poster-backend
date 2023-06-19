import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import * as dotenv from 'dotenv';
dotenv.config();

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1686755626183_2674';

  // add your egg config in here
  config.middleware = [];
  // 用户密码加密
  config.bcrypt = {
    saltRounds: 10,
  };
  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
    },
  };
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.nj': 'nunjucks',
    },
  };
  config.cors = {
    origin: 'http://localhost:5173',
    allowMethods: 'GET,POST,PUT,DELETE',
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    mongoose: { client: {
      url: 'mongodb://localhost:27017/poster',
      options: { useUnifiedTopology: true },
    } },
    // mongoose: {
    //   url: 'mongodb://localhost:27017/poster',
    // },
    security: {
      csrf: { enable: false },
    },
    jwt: { secret: 'power123456' },
    aliCloudConfig: {
      accessKeyId: process.env.ALC_ACCESS_KEY,
      accessKeySecret: process.env.ALC_SECRET_KEY,
      endpoint: 'dysmsapi.aliyuncs.com',
      name: 'sms_role@1363426906474430.onaliyun.com',
    },
    giteeOauthConfig: {
      cid: process.env.GITEE_CID,
      secret: process.env.GITEE_SECRET,
      redirectURL: 'http://127.0.0.1:7001/api/users/gitee/callback',
      authUrl: 'https://gitee.com/oauth/token',
      giteeUserInfo: 'https://gitee.com/api/v5/user',
    },

  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
