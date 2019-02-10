import Router from 'koa-router';

import { ArticleController, UserController } from '../controllers/frontend'

const router = new Router({ prefix: '/api' });

router
    .get('/', async (ctx) => {
        ctx.body = 'api is ok'
    })
    .get('/article/getCategory', ArticleController.getCategory)
    .post('/article/publish', ArticleController.publish)
    .post('/login', UserController.login)
    .post('/register', UserController.register)
    .get('/logout', UserController.logout)

export default router; // 简洁写法