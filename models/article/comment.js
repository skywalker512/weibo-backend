import mongoose from 'mongoose';
import ArticleSchema from './article'

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    authorId: { type: Schema.Types.ObjectId, require: true , ref: 'User'}, // author: { type: Schema.Types.ObjectId, ref: 'User' },
    articleId: { type: Schema.Types.ObjectId, require: true },
    // isPraise: { type: Number, default: 0 }, // 通过 lean 将此换为 js 的对象方便操作
    praiseNum: { type: Number, default: 0 },
    content: { type: String, required: true },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

// 这里是数据库的查询，而进到这一步已经有 用户验证了 所以 其 authorId 一定有效
CommentSchema.pre('validate', async function(next) {
    const res = await ArticleSchema.findOne({ _id: this.articleId });
    if( res ) {
        next();
    } else {
        throw new Error('你的评论没有相应的文章');
    }
})

CommentSchema.post('save',  async function(doc) {
    await ArticleSchema.findOneAndUpdate({ _id: doc.articleId }, { $inc: { commentNum: 1 } });
});

export default mongoose.model('Comment', CommentSchema);