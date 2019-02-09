import Router from 'koa-router';

const router = new Router({ prefix: '/api' });

router.get('/', async (ctx) => {
    ctx.body = 'api is ok'
});

export default router; // 简洁写法