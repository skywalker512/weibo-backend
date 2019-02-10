export default async (ctx, next) => {
    ctx.isAuthenticated = () => {
        if(ctx.cookies.get('userid') === ctx.session.userid) {
            console.log(ctx.session.userid, ctx.cookies.get('userid'));
            return true;
        } else {
            return false;
        }
    }

    await next();
}