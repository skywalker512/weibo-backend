export default async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', process.env.FE_URL)
    ctx.set('Access-Control-Allow-Credentials', 'true')
    ctx.set('Access-Control-Allow-Methods', 'GET,POST,HEAD,OPTIONS,PUT,PATCH')
    await next();
}