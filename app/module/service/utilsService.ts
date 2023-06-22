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
  // SSR选择成html字符串
  async renderToPageData(query: {id: string, uuid: string}) {
    console.log(query, 'query');
    const find = {
      id: Number(query.id),
      uuid: query.uuid,
    };
    const work = await this.model.Work.findOne(find).lean();
    if (!work) {
      throw new Error('work is not exit');
    }
    const { title, desc, content } = work;
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
    console.log(html);
    return { title, html, desc, formatStyle };
  }

}
