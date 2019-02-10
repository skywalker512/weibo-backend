import Koa from 'koa';
// import views from 'koa-views';
import json from 'koa-json'; // 用于 美化 json
import onerror from 'koa-onerror'; // 用于在 访问出错时 返回 html 页面
import bodyparser from 'koa-bodyparser'; // koa-bodyparser中间件可以把koa2上下文的formData数据解析到ctx.request.body
import logger from 'koa-logger'; // 用于在 控制台 显示相应
import session from 'koa-session';
import Redis from 'koa-redis'

// 路由
import { indexRouter, frontendRouter } from './routes/index';

// 中间件
import response from './middlewares/response';
import passport from './middlewares/passport';

// 连接数据库
import './models/db';

const app = new Koa();
// error handler
onerror(app);

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
// app.use(require('koa-static')(__dirname + '/public'))
app.keys = ['weibo:secret'];
const CONFIG = {
    key: 'weibo',
    maxAge: 604800000,  // 7天   0 为浏览器进程
    overwrite: true,
    signed: true,
    // session 默认保存在 用户端 使用 Redis 保存在服务器端 以防泄露
    store: new Redis(),
};
app.use(session(CONFIG, app));

// app.use(views(__dirname + '/views', {
//   extension: 'ejs'
// }))

// logger
// 这里的 时间应该是 从控件渲染 json 所花费的时间，但是与 logger 计算的时间不同
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
})

// routes
app.use(response); // 这里如果使用 () 则需要 response 函数返回一个函数，use 接收的就是一个函数
app.use(passport);
app.use(indexRouter.routes());
app.use(indexRouter.allowedMethods());
app.use(frontendRouter.routes());
app.use(frontendRouter.allowedMethods());

// error-handling 在控制台中抛出 log
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx);
});

export default app;
