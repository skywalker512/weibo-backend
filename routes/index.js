import Router from 'koa-router';
import frontendRouter from './frontend'

const indexRouter = new Router({prefix: '/'})

indexRouter.get('/', async (ctx) => {
  ctx.body = 'OK'
});

export { indexRouter, frontendRouter };
