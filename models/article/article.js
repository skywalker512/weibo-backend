import mongoose from 'mongoose';
import CommentModel from './comment';
import CategoryModel from './catagory';

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    // title: { type: String, required: true }, 微博是不需要 title 的
    categoryId: { type: Schema.Types.ObjectId, required: true, ref: 'Catagory' }, // ref: 'Catagory' ?? 在使用 populate 的时候必须使用 ref
    cover: { type: String, default: null },
    authorId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    changedBy: { type: Schema.Types.ObjectId, default: null, ref: 'User' },
    review: { type: Number, default: 0 },
    praiseNum: { type: Number, default: 0 }, // 这里应该要考虑性能问题，不使用数据库查询总个数而是直接统计
    praise: [{ type: Schema.Types.ObjectId, ref:'User' }],
    content: { type: String, required: true },
    commentNum: { type: Number, default: 0 },
    // comments: [{ type: Schema.Types.ObjectId, ref:'Comment' }], 为了删除方便 使用 我属于谁的 方式
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastCommentAt: { type: Date, default: Date.now }, // 最热话题
})

ArticleSchema.pre('validate', async function(next) {
    const res1 = await CategoryModel.findOne({ _id: this.categoryId });
    if( !res1 ) {
        throw new Error('你发布的文章没有相应的节点');
    } else {
        next();
    }
})

ArticleSchema.post('findOneAndRemove', async function(doc) {
    await CommentModel.deleteMany({ articleId: doc._id });
});

ArticleSchema.post('findOneAndUpdate', async function(doc) {
    await CategoryModel.findOneAndUpdate({ _id: doc.categoryId }, { $set: { lastPublishAt: Date.now() } });
    doc.updatedAt = Date.now();
    await doc.save();
})

export default mongoose.model('Article', ArticleSchema);