import tracer from 'tracer'
const logger = tracer.colorConsole({
    level: 'error',
    format: '{{timestamp}} <{{title}}> {{file}}(#{{line}}): {{message}}',
    file: 'error.log',
    path: __dirname
});

export default async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (!err) {
            return ctx.error({ msg: '未知错误' });
        }
        logger.error(err.stack);
        if (process.env.APP_DEBUG) {
            return ctx.error({ msg: '服务器出错',  status: 500, code: ctx.status, error: err.stack  });
        } else {
            return ctx.error({ msg: '服务器出错',  status: 500, code: ctx.status });
        }
    }
}