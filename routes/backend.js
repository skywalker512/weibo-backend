import Router from 'koa-router';

import { ArticleController } from '../controllers/backend'

const router = new Router({ prefix: '/api' });

router
    .get('/backend', async (ctx) => {
        ctx.body = 'backend api is ok'
    })
    .post('/category', ArticleController.createCategory)
    .put('/category/:_id', ArticleController.changeCategory)

export default router; // 简洁写法