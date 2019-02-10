import ArticleModel from '../../models/article/article';
import CategoryModel from '../../models/article/catagory'
import md5 from 'md5'

// const CommentModel = mongoose.model('Comment');

// 这里使用 类的静态方法来创建，在内存上的使用应该和使用对象或者实例化是相同的只是写起来明了一些
class ArticleController {
    // 发布文章
    static async publish(ctx) {
        const user = ctx.session.user;
        if(!user) return ctx.error({ msg: '您还没有登陆', code: 40001 });
        
        // const _id = user._id;
        const { _id } = user;

        const data = ctx.request.body;
        if(!data) return ctx.error({ msg: '数据发送失败', code: 40002 });
        const isExit = await ArticleModel.findOne({ title: data.title });
        if(isExit) return ctx.error({ msg: '标题已存在', code: 40003 });

        // author: { type: Schema.Types.ObjectId, ref: 'User' },
        data.author = _id;
        // praise: { num: Number, user: Array },
        data.praise = { num: 0, user:[] };

        // const temp = new ArticleModel(data)
        // const result = await temp.save()
        const result = await ArticleModel.create(data);
        if(!result) return ctx.error({ msg: '文章创建失败', code: 40004 });

        return ctx.success({ msg: '发表成功', data: result });
    }

    static async getCategory(ctx) {
        const data = await CategoryModel.find();
        // if( !data.length ) return ctx.error({ msg: '暂无数据', code: '60001'});
        if ( ctx.isAuthenticated() ) return ctx.error({ msg: { a: ctx.session.userId, b: md5('weibo' + ctx.session.userId) }, code: 60001 });
        return ctx.success({ data });
    }
}

export default ArticleController;