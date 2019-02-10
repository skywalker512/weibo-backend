import md5 from 'md5';

export default async (ctx, next) => {
    ctx.isAuthenticated = () => {
        if( ctx.cookies.get('userid') && ctx.cookies.get('userid') ===  md5('weibo' + ctx.session.userId) ) {
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
        const keep_user = 604800000;  // 7天   0 为浏览器进程
        ctx.cookies.set('userid', md5('weibo' + userId), { maxAge: keep_user, httpOnly: false });
    }

    ctx.removeCookies = () => {
        ctx.session.userId = null;
        ctx.session.userGroup = null;
        ctx.cookies.set('userid', null);
    }

    await next();
}