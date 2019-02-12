export default async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", "http://redrock.test")
    ctx.set("Access-Control-Allow-Credentials", "true")
    await next();
}