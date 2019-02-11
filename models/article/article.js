import mongoose from 'mongoose';
import CommentModel from './comment';

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    // title: { type: String, required: true }, 微博是不需要 title 的
    categoryId: { type: Schema.Types.ObjectId, required: true, ref: 'Catagory' }, // ref: 'Catagory' ?? 在使用 populate 的时候必须使用 ref
    cover: { type: String, default: null },
    authorId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    review: { type: Number, default: 0 },
    praise: { num: Number, user: Array }, // 这里应该要考虑性能问题，不使用数据库查询总个数而是直接统计
    content: { type: String, required: true },
    commentNum: { type: Number, default: 0 },
    // comments: [{ type: Schema.Types.ObjectId, ref:'Comment' }], 为了删除方便 使用 我属于谁的 方式
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastCommentAt: { type: Date, default: Date.now }, // 最热话题
})

ArticleSchema.post('findOneAndRemove', async function(doc) {
    await CommentModel.deleteMany({ articleId: doc._id });
});

export default mongoose.model('Article', ArticleSchema);