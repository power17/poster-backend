const { IBoot, Application } = require('egg')
class AppBoot {
    constructor(app) {
        this.app = app
    }
    configWillLoad() {
        // console.log('config', this.app.config.baseUrl)

        this.app.config.coreMiddleware.unshift('myLogger')
        // console.log('middleware', this.app.config.coreMiddleware)

    }

}
module.exports = AppBoot