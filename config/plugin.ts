import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  tegg: {
    enable: true,
    package: '@eggjs/tegg-plugin',
  },
  teggConfig: {
    enable: true,
    package: '@eggjs/tegg-config',
  },
  teggController: {
    enable: true,
    package: '@eggjs/tegg-controller-plugin',
  },
  teggSchedule: {
    enable: true,
    package: '@eggjs/tegg-schedule-plugin',
  },
  eventbusModule: {
    enable: true,
    package: '@eggjs/tegg-eventbus-plugin',
  },
  aopModule: {
    enable: true,
    package: '@eggjs/tegg-aop-plugin',
  },
  tracer: {
    enable: true,
    package: 'egg-tracer',
  },
  // mongoose-egg 连接数据库
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  // 数据验证
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  // 加密
  bcrypt: {
    enable: true,
    package: 'egg-bcrypt',
  },
  // redis
  redis: {
    enable: true,
    package: 'egg-redis',
  },
};

export default plugin;
