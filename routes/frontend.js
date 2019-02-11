import Router from 'koa-router';

import { ArticleController, UserController, CommentController } from '../controllers/frontend'

const router = new Router({ prefix: '/api' });

router
    .get('/', async (ctx) => {
        ctx.body = {
            '当前用户': '/api/user',
            '获取分类列表': '/category{/_id}'
        }
    })

    // 不包含 _id 的有 get(列表) post(新的)
    // 包含的有 get(详情) put(修改) delete(删除)
    .get('/category', ArticleController.getCategory) // 获取分类列表
    // post backend
    .get('/category/:_id', ArticleController.getCategoryArticle) // 特定的分类下的文章列表列表
    // put delete backend
    
    .get('/article', ArticleController.getArticle) // 获取文章列表
    .post('/article', ArticleController.publishArticle) // 发布文章
    .get('/article/:_id', ArticleController.getArticleDetail) // 获取某个文章的详细信息
    .put('/article/:_id', ArticleController.changeArticle) // 更新文章 提供文章的全部信息
    .delete('/article/:_id', ArticleController.deleteArticle) // 删除文章

    .post('/comment', CommentController.publishComment)

    // 用户相关
    .post('/login', UserController.login)
    .post('/register', UserController.register)
    .get('/logout', UserController.logout)
    .get('/user', UserController.getUser) // 获取当前用户

export default router; // 简洁写法