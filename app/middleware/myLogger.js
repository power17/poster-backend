const { appendFileSync } = require('fs');
module.exports = (option, app) => {
    return async (ctx, next) => {
        const startTime = Date.now();
        const requestTime = new Date();
        await next();
        const ms = Date.now() - startTime;
        const logTime = `${requestTime} -- ${ctx.method} -- ${ctx.url} -- ${ms}ms`
        // if (option.allowedMethod.includes(ctx.method)) {
        //     appendFileSync('./log.txt', logTime + '\n')
        // }
        appendFileSync('./log.txt', logTime + '\n')
        console.log('logger start')

    }
};
