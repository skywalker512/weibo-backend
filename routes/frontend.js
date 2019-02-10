import Router from 'koa-router';

import { ArticleController, UserController } from '../controllers/frontend'

const router = new Router({ prefix: '/api' });

router
    .get('/', async (ctx) => {
        ctx.body = 'api is ok'
    })
    .get('/article/getCategory', ArticleController.getCategory)
    .post('/article/publishArticle', ArticleController.publishArticle)
    .put('/article/changeArticle', ArticleController.changeArticle)
    .get('/article/getDetail', ArticleController.getDetail)

    // 用户相关
    .post('/login', UserController.login)
    .post('/register', UserController.register)
    .get('/logout', UserController.logout)
    .get('/getUser', UserController.getUser)

export default router; // 简洁写法