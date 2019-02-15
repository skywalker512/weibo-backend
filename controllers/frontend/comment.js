import CommentModel from '../../models/article/comment';
import UserModel from '../../models/user/user'
import PraiseModel from '../../models/article/praise'
// 这里使用 类的静态方法来创建，在内存上的使用应该和使用对象或者实例化是相同的只是写起来明了一些
class CommentController {
    // 发布评论
    static async publishComment(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆' });

        const data = ctx.request.body;
        if (!(Object.keys(data).length === 2)) return ctx.error({ msg: '数据发送失败' });

        data.authorId = ctx.session.userId;

        let result = await CommentModel.create(data);
        const user = await UserModel.findOne({_id: ctx.session.userId}, { name: 1, avatar: 1 })
        result.authorId = user
        if (!result) return ctx.error({ msg: '评论创建失败' });
        return ctx.success({ msg: '发表成功', data: result });
    }

    // 评论点赞
    static async parise(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆' });
        const _id = ctx.params._id
        const comment = await CommentModel.findOne({ _id }, { praiseNum: 1, praise: 1})
        if( !comment )  return ctx.error({ msg: '获取详情数据失败!' })
        const parise = await PraiseModel.findOne({ articleId: _id, authorId: ctx.session.userId })
        if( parise ) {
            const praiseNum = Number(comment.praiseNum) - 1
            await PraiseModel.deleteOne({ articleId: _id, authorId: ctx.session.userId })
            const result = await CommentModel.findOneAndUpdate({ _id }, { $set:{ praiseNum } }, { new:true })
            if(!result)  return ctx.error({ msg: '取消点赞失败' });
            return ctx.success({ msg:'取消点赞成功' , data: result.praiseNum });
        } else {
            const praiseNum = Number(comment.praiseNum) + 1
            await PraiseModel.create({ articleId: _id, authorId: ctx.session.userId })
            const result = await CommentModel.findOneAndUpdate({ _id }, { $set:{ praiseNum } }, { new:true })
            if(!result)  return ctx.error({ msg: '点赞失败!' });
            return ctx.success({ msg:'点赞成功', data: result.praiseNum });
        }
    }
}

export default CommentController;