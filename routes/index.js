import Router from 'koa-router';
import frontendRouter from './frontend';
import backendRouter from './backend'

const indexRouter = new Router({ prefix: '/' });

indexRouter.get('/', async (ctx) => {
    ctx.body = 'OK';
})

export { indexRouter, frontendRouter, backendRouter };
