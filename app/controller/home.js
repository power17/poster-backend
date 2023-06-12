'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const { baseUrl } = ctx.app.config
    const resp = { age: 11 }
    // this.app.echo('jsof')
    // const res = await this.app.axiosInstance.get()
    // console.log(res)
    ctx.body = this.app
    // ctx.helper.success({ ctx, resp })
  }
}

module.exports = HomeController;
