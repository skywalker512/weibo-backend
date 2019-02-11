import ArticleModel from '../../models/article/article';
import CategoryModel from '../../models/article/catagory';
import CommentModel from '../../models/article/comment';

// 这里使用 类的静态方法来创建，在内存上的使用应该和使用对象或者实例化是相同的只是写起来明了一些
class ArticleController {
    // 发布文章
    static async publishArticle(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆' });

        const data = ctx.request.body;
        if (!(Object.keys(data).length === 2)) return ctx.error({ msg: '数据发送失败' });

        // author: { type: Schema.Types.ObjectId, ref: 'User' },
        data.authorId = ctx.session.userId;

        // const temp = new ArticleModel(data)
        // const result = await temp.save()
        const result = await ArticleModel.create(data);
        if (!result) return ctx.error({ msg: '文章创建失败' });
        return ctx.success({ msg: '发表成功', data: result });
    }

    // 修改文章
    static async changeArticle(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆' });

        const _id = ctx.params._id;
        if (!_id) return ctx.error({ msg: '数据发送失败' });
        const data = ctx.request.body;
        if (!(Object.keys(data).length === 3)) return ctx.error({ msg: '数据发送失败' });

        const article = await ArticleModel.findOne({_id});
        if (!article) return ctx.error({ msg: '获取详情数据失败!' });

        if (!(article.authorId === ctx.session.userId || ctx.isAdmin())) return ctx.error({ msg: '你没有权限' });
        data.changedBy = ctx.session.userId;
        const result = await ArticleModel.findOneAndUpdate({_id}, { $set: data }, { new: true }); // { new: true } 修改了之后返回新的文章
        if (!result) return ctx.error({ msg: '文章修改失败' });
        return ctx.success({ msg: '修改成功', data: result });
    }

    // 删除文章
    static async deleteArticle(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆' });
        // 在修改的时候必须要注意 _id
        const _id = ctx.params._id;
        if (!_id) return ctx.error({ msg: '数据发送失败' });

        const article = await ArticleModel.findOne({_id});
        if (!article) return ctx.error({ msg: '已被删除' });

        if (!(article.authorId === ctx.session.userId || ctx.isAdmin())) return ctx.error({ msg: '你没有权限' });
        
        const result = await ArticleModel.findOneAndRemove({ _id });
        if( !result ) return ctx.error({ msg: '文章删除失败' });

        return ctx.success({ msg: '删除成功' });
    }

    // 获取文章列表
    static async getArticle(ctx) {
        let { per_page, page } = ctx.query;
        if (!page) page = 1;
        if (!per_page) per_page = 10;
        const skip = (page - 1) * per_page; // 第一页 从 0 开始

        const articles = await ArticleModel.find().sort({ createdAt: '-1' }).skip(skip).limit(per_page).populate('authorId', { name: 1, avatar: 1 }).populate('categoryId', { name: 1 });
        if (!articles) return ctx.error({ msg: '获取详情数据失败!' });

        return ctx.success({ data: articles });
    }

    // 获取分类信息
    static async getCategory(ctx) {
        const data = await CategoryModel.find();
        if (!data.length) return ctx.error({ msg: '暂无数据' });
        return ctx.success({ data });
    }

    // 获取分类下的文章列表
    static async getCategoryArticle(ctx) {
        const _id = ctx.params._id;
        if (!_id) return ctx.error({ msg: '数据发送失败' });

        let { per_page, page } = ctx.query;
        if (!page) page = 1;
        if (!per_page) per_page = 10;
        const skip = (page - 1) * per_page; // 第一页 从 0 开始

        const articles = await ArticleModel.find({ categoryId: _id }).sort({ createdAt: '-1' }).skip(skip).limit(per_page);;
        if (!articles) return ctx.error({ msg: '获取详情数据失败!' });

        return ctx.success({ data: articles });
    }

    // 获取文章详情、评论、(点赞)
    static async getArticleDetail(ctx) {
        const _id = ctx.params._id;
        if (!_id) return ctx.error({ msg: '数据发送失败' });

        let { per_page, page } = ctx.query;
        // author: { type: Schema.Types.ObjectId, ref: 'User' },
        const article = await ArticleModel.findOne({_id}).populate('authorId', { name: 1, avatar: 1 }).populate('categoryId', { name: 1 });
        if (!article) return ctx.error({ msg: '获取详情数据失败!' });

        const review = article.review + 1;
        await ArticleModel.findOneAndUpdate({ _id: article._id}, { $set: { review } }); // $set: 只会修改其中的一项 而不是全部改变


        if (!page) page = 1;
        if (!per_page) per_page = 10;
        const skip = (page - 1) * per_page; // 第一页 从 0 开始

        // article_id: { type: Schema.Types.ObjectId, require: true },
        // createdAt: { type: Date, default: Date.now },
        const comments = await CommentModel.find({ articleId: article._id }).sort({ createdAt: '-1' }).skip(skip).limit(per_page);

        return ctx.success({ data: { article, comments } });
    }

}

export default ArticleController;