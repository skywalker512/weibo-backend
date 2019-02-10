import Router from 'koa-router';

import { ArticleController } from '../controllers/backend'

const router = new Router({ prefix: '/api/backend' });

router
    .get('/', async (ctx) => {
        ctx.body = 'backend api is ok'
    })
    .post('/createCategory', ArticleController.createCategory)

export default router; // 简洁写法