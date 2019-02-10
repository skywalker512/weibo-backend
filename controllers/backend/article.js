import CategoryModel from '../../models/article/catagory';

class ArticleController { 
    static async createCategory(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆' });
        if (!ctx.isAdmin()) return ctx.error({ msg: '您没有权限访问' });
        
        const { name } = ctx.requset.body;
        const isExit = await CategoryModel.find({ name })
        if( isExit ) return ctx.error({ msg: '分类已存在' });
    }
}

export default ArticleController;

