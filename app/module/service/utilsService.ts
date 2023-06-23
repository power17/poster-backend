import { createSSRApp } from 'vue';
import legoComponent from 'lego-components';
import { AccessLevel, Inject, SingletonProto } from '@eggjs/tegg';
import { MongooseModels } from 'typings/app';
import { renderToString } from '@vue/server-renderer';
@SingletonProto({
  // 如果需要在上层使用，需要把 accessLevel 显示声明为 public
  accessLevel: AccessLevel.PUBLIC,
})
export class UtilsService {
  @Inject()
  private model: MongooseModels;
  parseToStyle(style = {}) {
    const styleArr = Object.keys(style).map(key => {
      const formatKey = key.replace(/[A-Z]/, c => {
        return `-${c.toLowerCase()}`;
      });


      return `${formatKey}: ${style[key]}`;
    });
    return styleArr.join(';');

  }
  // 转化为vw
  pxTovw(components = []) {
    const reg = /^(\d+(\.\d+)?)px$/;
    components.forEach((component: any = {}) => {
      const props = component.props;
      Object.keys(props).forEach(key => {
        const value = props[key];
        if (typeof value !== 'string') {
          return;
        }
        if (!reg.test(value)) {
          return;
        }
        const matchValue = value.match(reg) || [];
        const num = parseFloat(matchValue[1]);
        const vwNum = (num / 375) * 100;
        if (num) {
          props[key] = `${vwNum.toFixed(2)}vw`;
        }

      });
    });
  }

  // SSR选择成html字符串
  async renderToPageData(query: {id: string, uuid: string}) {
    const find = {
      id: Number(query.id),
      uuid: query.uuid,
    };
    const work = await this.model.Work.findOne(find).lean();
    if (!work) {
      throw new Error('work is not exit');
    }
    const { title, desc, content } = work;
    this.pxTovw(content && content.components);
    const vueApp = createSSRApp({
      data() {
        return {
          components: (content && content.components) || [],

        };
      },
      template: '<final-page :components="components"></final-page>',

    });
    vueApp.use(legoComponent);
    // 加载样式到body上
    const formatStyle = this.parseToStyle(content?.props);
    // 转换为字符串
    const html = await renderToString(vueApp);
    return { title, html, desc, formatStyle };
  }

}
