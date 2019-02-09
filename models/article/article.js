import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, required: true }, // ref: 'Catagory' ??
    cover: { type: String, default: null },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    review: { type: Number, default: 0 },
    praise: { num: Number, user: Array }, // 这里应该要考虑性能问题，不使用数据库查询总个数而是直接统计
    content: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref:'Comment' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastCommentAt: { type: Date, default: Date.now }, // 最热话题
})

export default mongoose.model('Article', ArticleSchema);