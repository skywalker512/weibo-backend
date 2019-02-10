import Router from 'koa-router';

import { ArticleController } from '../controllers/frontend'

const router = new Router({ prefix: '/api' });

router
    .get('/', async (ctx) => {
        ctx.body = 'api is ok'
    })
    .get('/article/getCategory', ArticleController.getCategory)
    .post('/article/publish', ArticleController.publish)

export default router; // 简洁写法