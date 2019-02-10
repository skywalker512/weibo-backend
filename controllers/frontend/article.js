import ArticleModel from '../../models/article/article';
import CategoryModel from '../../models/article/catagory';
import CommentModel from '../../models/article/comment';

// 这里使用 类的静态方法来创建，在内存上的使用应该和使用对象或者实例化是相同的只是写起来明了一些
class ArticleController {
    // 发布文章
    static async publishArticle(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆'  });

        const data = ctx.request.body;
        if (!data) return ctx.error({ msg: '数据发送失败'  });

        // const isExit = await ArticleModel.findOne({ title: data.title });
        // if (isExit) return ctx.error({ msg: '标题已存在'  });

        // author: { type: Schema.Types.ObjectId, ref: 'User' },
        data.authorId = ctx.session.userId;
        // praise: { num: Number, user: Array },
        data.praise = { num: 0, user: [] };

        // const temp = new ArticleModel(data)
        // const result = await temp.save()
        const result = await ArticleModel.create(data);
        if (!result) return ctx.error({ msg: '文章创建失败'  });
        // 更新 分类，用于 热门节点
        await CategoryModel.findByIdAndUpdate(data.categoryId, { $set: { lastPublishAt: Date.now() } });
        return ctx.success({ msg: '发表成功', data: result });
    }

    // 修改文章
    static async changeArticle(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆'  });
        // 在修改的时候必须要注意 _id
        let data = ctx.request.body;        
        if (!data) return ctx.error({ msg: '数据发送失败'  });
        const _id = data._id;
        delete data._id;
        const article = await ArticleModel.findById(_id);
        if(!article) return ctx.error({msg: '获取详情数据失败!' });

        if( !(article.authorId === ctx.session.userId || ctx.isAdmin()) ) return ctx.error({msg: '你没有权限' });
        data.updatedAt = Date.now();
        const result = await ArticleModel.findByIdAndUpdate(_id, { $set: data }, { new: true }); // { new: true } 修改了之后返回新的文章
        if (!result) return ctx.error({ msg: '文章修改失败'  });
        return ctx.success({ msg: '修改成功', data: result });
    }


    // 获取分类信息
    static async getCategory(ctx) {
        const data = await CategoryModel.find();
        if (!data.length) return ctx.error({ msg: '暂无数据'  });
        return ctx.success({ data });
    }

    // 获取文章详情、评论、(点赞)
    static async getDetail(ctx) {
        const id = ctx.query.id;
        let { pageSize, currentPage } = ctx.query;
        // author: { type: Schema.Types.ObjectId, ref: 'User' },
        const article = await ArticleModel.findById(id).populate('authorId', { name: 1, avatar: 1 }).populate('categoryId', { name: 1 });
        if(!article) return ctx.error({msg: '获取详情数据失败!' });

        const review = article.review + 1;
        await ArticleModel.findByIdAndUpdate(article._id, { $set: {review} }); // $set: 只会修改其中的一项 而不是全部改变

        
        if(!currentPage) currentPage = 1;
        if(!pageSize) pageSize = 10;
        const skip = ( currentPage - 1 ) * pageSize; // 第一页 从 0 开始
        
        // article_id: { type: Schema.Types.ObjectId, require: true },
        // createdAt: { type: Date, default: Date.now },
        const comments = await CommentModel.find({ articleId: article._id }).sort({ createdAt: '-1' }).skip(skip).limit(pageSize);

        return ctx.success({ data: { article, comments } });
    }

}

export default ArticleController;