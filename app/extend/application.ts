import Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';
import { Application } from 'egg';
const ALICLIENT = Symbol('applicat#aliclient');
export default {
  get aliClient():Dysmsapi20170525 {
    const that = this as unknown as Application;
    const { accessKeyId, accessKeySecret, endpoint } = that.config.aliCloudConfig;
    const config = new $OpenApi.Config({
      // 必填，您的 AccessKey ID
      accessKeyId,
      // 必填，您的 AccessKey Secret
      accessKeySecret,
    });
      // 访问的域名
    config.endpoint = endpoint;
    this[ALICLIENT] = new Dysmsapi20170525(config);
    return this[ALICLIENT];
  },
};
