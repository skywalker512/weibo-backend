// 将会在 routes 之前 将 success 和 error 方法创建好，以在 控制部分可以复用

export default async (ctx, next) => {
    // ---> 进来

    // ctx.error 函数将接收的参数包含 data msg status error 对象
    ctx.error = ({ data, msg, status, error }) => {
        ctx.status = status || 400; // 400 Bad Request 客户端错误
        ctx.body = { code: -200, msg, data, error };
    }

    ctx.success = ({ data, msg }) => {
        ctx.body = { code: 200, msg, data };
    }
    // 交给下一个中间件
    await next();
    // 在下一个中间件的全部代码执行完之前 下面代码都不会执行 体现异步
    // ---> 出去
}