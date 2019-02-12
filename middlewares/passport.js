import md5 from 'md5';

export default async (ctx, next) => {
    ctx.isAuthenticated = () => {
        const sym = Object.getOwnPropertySymbols(ctx)[0];
        if( ctx.cookies.get('weibo') && ctx.cookies.get('weibo') ===  ctx[sym].externalKey) {
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
    }

    ctx.removeCookies = () => {
        ctx.session.userId = null;
        ctx.session.userGroup = null;
    }

    await next();
}