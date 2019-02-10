import CategoryModel from '../../models/article/catagory';

class ArticleController { 
    static async createCategory(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆', code: 40006 });
        if (!ctx.isAdmin()) return ctx.error({ msg: '您没有权限访问', code: 40006 });
        ctx.success({ msg: 'ok'});
    }
}

export default ArticleController;

