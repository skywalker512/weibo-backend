import CategoryModel from '../../models/article/catagory';

class ArticleController { 
    static async createCategory(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆' });
        if (!ctx.isAdmin()) return ctx.error({ msg: '您没有权限访问' });

        const { name } = ctx.request.body;
        const isExit = await CategoryModel.findOne({ name });
        if( isExit ) return ctx.error({ msg: '分类已存在' });
        const result = await CategoryModel.create({ name });
        if( !result ) return ctx.error({ msg: '分类创建失败' });

        return ctx.success({ msg: '创建成功', data: result });
    }
}

export default ArticleController;

