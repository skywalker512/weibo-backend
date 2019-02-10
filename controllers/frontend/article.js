import ArticleModel from '../../models/article/article';
import CategoryModel from '../../models/article/catagory';
import CommentModel from '../../models/article/comment';

// 这里使用 类的静态方法来创建，在内存上的使用应该和使用对象或者实例化是相同的只是写起来明了一些
class ArticleController {
    // 发布文章
    static async publish(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆'  });

        const data = ctx.request.body;
        if (!data) return ctx.error({ msg: '数据发送失败'  });

        const isExit = await ArticleModel.findOne({ title: data.title });
        if (isExit) return ctx.error({ msg: '标题已存在'  });

        // author: { type: Schema.Types.ObjectId, ref: 'User' },
        data.author = ctx.session.userId;
        // praise: { num: Number, user: Array },
        data.praise = { num: 0, user: [] };

        // const temp = new ArticleModel(data)
        // const result = await temp.save()
        const result = await ArticleModel.create(data);
        if (!result) return ctx.error({ msg: '文章创建失败'  });

        return ctx.success({ msg: '发表成功', data: result });
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
        await ArticleModel.findByIdAndUpdate(article._id, { $set: {review} });

        
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