import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};
  config.baseUrl = 'prod.url';
  config.security = {
    domainWhiteList: ['https://power17.xyz'], // cors
  };
  // jwt 失效时间
  config.jwtExpires = '2 days';
  config.giteeOauthConfig = {
    redirectURL: 'https://power17.xyz/api/users/gitee/callback',
  };
  config.h5baseUrl = 'https://power17.xyz/api/utils/pages';
  // config.mongoose = {
  //   client: {
  //     url: 'mongodb://poster-mongo:27017/poster',
  //     options: { useUnifiedTopology: true },
  //   },
  // };

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
        useUnifiedTopology: true,
      },
    },
  };

  config.redis = {
    client: {
      port: 6379,
      host: 'poster-redis',
      password: process.env.REDIS_PASSWORD,
      db: 0,
    },
  };
  return config;
};
