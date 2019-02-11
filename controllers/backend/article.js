import CategoryModel from '../../models/article/catagory';

class ArticleController { 
    // 创建分类
    static async createCategory(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆' });
        if (!ctx.isAdmin()) return ctx.error({ msg: '您没有权限访问' });

        const { name } = ctx.request.body;
        if (!name) return ctx.error({ msg: '数据发送失败' });

        const isExit = await CategoryModel.findOne({ name });
        if( isExit ) return ctx.error({ msg: '分类已存在' });

        const result = await CategoryModel.create({ name });
        if( !result ) return ctx.error({ msg: '分类创建失败' });

        return ctx.success({ msg: '创建成功', data: result });
    }

    // 修改分类
    static async changeCategory(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆' });
        if (!ctx.isAdmin()) return ctx.error({ msg: '您没有权限访问' });

        const _id = ctx.params._id;
        if (!_id) return ctx.error({ msg: '数据发送失败' });
        const { name } = ctx.request.body;
        if (!name) return ctx.error({ msg: '数据发送失败' });

        const category = await CategoryModel.findById(_id);
        if (!category) return ctx.error({ msg: '获取详情数据失败!' });

        const result = await CategoryModel.findByIdAndUpdate(_id, { $set: { name } }, { new: true }); // { new: true } 修改了之后返回新的文章
        if (!result) return ctx.error({ msg: '分类修改失败' });
        return ctx.success({ msg: '修改成功', data: result });
    }

    // 删除分类
    static async deleteCategory(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆' });
        if (!ctx.isAdmin()) return ctx.error({ msg: '您没有权限访问' });

        const _id = ctx.params._id;
        if (!_id) return ctx.error({ msg: '数据发送失败' });

        const category = await CategoryModel.findById(_id);
        if (!category) return ctx.error({ msg: '已被删除' });
        
        if (!result) return ctx.error({ msg: '分类修改失败' });
        return ctx.success({ msg: '修改成功', data: result });
    }
}

export default ArticleController;

