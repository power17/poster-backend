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
  // config.mongoose = {
  //   client: {
  //     url: 'mongodb://poster-mongo:27017/poster',
  //     options: { useUnifiedTopology: true },
  //   },
  // };
  console.log(111);
  console.log(process.env.MONGO_DB_USERNAME, process.env.MONGO_DB_PASSWORD, '251432423432432');
  config.mongoose = {
    // url: 'mongodb://127.0.0.1:27017/poster',
    // options: {
    //   user: process.env.MONGO_DB_USERNAME,
    //   pass: process.env.MONGO_DB_PASSWORD,
    // },
    client: {
      url: 'mongodb://poster-mongo:27017/poster',
      options: {
        user: process.env.MONGO_DB_USERNAME,
        pass: process.env.MONGO_DB_PASSWORD,
      },
    },
  };

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
