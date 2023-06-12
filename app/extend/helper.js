module.exports = {
    success({ ctx, resp, msg }) {
        ctx.body = {
            error: 0,
            data: resp ? resp : null,
            msg: msg ? msg : '请求成功'
        }
        ctx.status = 200
    }
}