export default async (ctx, next) => {
    ctx.isAuthenticated = () => {
        if( ctx.session.userId ) {
            return true;
        } else {
            return false;
        }
    }

    ctx.isAdmin = () => {
        if(ctx.session.userGroup === 1) {
            return true;
        } else { 
            return false;
        }
    }

    ctx.setCookies = ( userId, userGroup ) => {
        ctx.session.userId = userId;
        ctx.session.userGroup = userGroup;
        ctx.cookies.set('userid', userId, { maxAge: 604800000, httpOnly: false });
    }

    ctx.removeCookies = () => {
        ctx.session.userId = null;
        ctx.session.userGroup = null;
        ctx.cookies.set('userid',null);
    }

    await next();
}