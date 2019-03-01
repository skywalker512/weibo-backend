import mongoose from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import { url } from '../../config/common'

const Schema = mongoose.Schema

const VideoSchema = new Schema({
    authorId: { type: Schema.Types.ObjectId, require: true, ref: 'User' },
    articleId: { type: Schema.Types.ObjectId, default: null, ref: 'Article' },
    location: { type: String, default: null }, // 判断存储位置
    path: { type: String, default: null }, // 储存位置，在这里 url 由查询的时候再拼接
    size: { type: Number, required: true },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

VideoSchema.virtual('url').get(function () {
    return url[this.location] + this.path;
});

VideoSchema.plugin(mongooseLeanVirtuals)

export default mongoose.model('Video', VideoSchema)