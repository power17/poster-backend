import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.baseUrl = 'prod.url';
  config.security = {
    domainWhiteList: [ 'http://120.78.65.45' ],
  };
  // jwt 失效时间
  config.jwtExpires = '2 days';
  config.giteeOauthConfig = {
    redirectURL: 'http://120.78.65.45/api/users/gitee/callback',
  };
  config.h5baseUrl = 'http://120.78.65.45/api/utils/pages';
  config.mongoose = {
    client: {
      url: 'mongodb://mongo:27017/poster',
      options: { useUnifiedTopology: true },
    },
  };
  // config.mongoose = {
  //   client: {
  //     url: 'XXXX',
  //     options: {
  //       dbName: '',
  //       user: '',
  //       pass: '',
  //     },
  //   },
  // };
  // config.redis = {
  //   client: {
  //     port: 6379,
  //     host: '127.0.0.1',
  //     password: '',
  //     db: 0,
  //   },
  // };
  return config;
};
