const axios = require('axios')
const AXIOS = Symbol('Application#axios')
module.exports = {
    echo(msg) {
        return `hello${msg}${this.config.name}`
    },
    // get axiosInstance() {
    //     if (!this[AXIOS]) {
    //         this[AXIOS] = axios.create({
    //             baseUrl: 'https://baidu.com',
    //             timeout: 5000
    //         })
    //     }
    //     return this[AXIOS]
    // }

}
