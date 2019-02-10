export default async (ctx, next) => {
    ctx.isAuthenticated = () => {
        if(ctx.cookies.get('userid') === ctx.session.userid) {
            console.log(ctx.session.userid, ctx.cookies.get('userid'));
            return true;
        } else {
            return false;
        }
    }

    ctx.setCookies = ( userId ) => {
        ctx.session.userid = userId;
        const keep_user = 604800000; // 7天
        ctx.cookies.set('userid', userId, { maxAge: keep_user, httpOnly: false });
    }

    ctx.removeCookies = () => {
        ctx.session.userid = null;
        ctx.cookies.set('userid', null);
    }

    await next();
}