import CommentModel from '../../models/article/comment';

// 这里使用 类的静态方法来创建，在内存上的使用应该和使用对象或者实例化是相同的只是写起来明了一些
class CommentController {
    // 发布评论
    static async publishComment(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆' });

        const data = ctx.request.body;
        if (!(Object.keys(data).length === 2)) return ctx.error({ msg: '数据发送失败' });

        data.authorId = ctx.session.userId;

        const result = await CommentModel.create(data);
        if (!result) return ctx.error({ msg: '评论创建失败' });
        return ctx.success({ msg: '发表成功', data: result });
    }
}

export default CommentController;