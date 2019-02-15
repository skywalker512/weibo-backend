import mongoose from 'mongoose';
import CommentModel from './comment';
import CategoryModel from './catagory';

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    categoryId: { type: Schema.Types.ObjectId, required: true, ref: 'Catagory' },
    authorId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    changedBy: { type: Schema.Types.ObjectId, default: null, ref: 'User' },
    review: { type: Number, default: 0 },
    praiseNum: { type: Number, default: 0 },
    favoriteNum: { type: Number, default: 0 },
    content: { type: String, required: true },
    commentNum: { type: Number, default: 0 },
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