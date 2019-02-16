import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ImageSchema = new Schema({
    authorId: { type: Schema.Types.ObjectId, require: true, ref: 'User'},
    articleId: { type: Schema.Types.ObjectId, default: null, ref: 'Article'},
    height: { type: Number, required: true }, // 为以后的幻灯片做准备
    width: { type: Number, required: true },
    location: { type: String, default: null }, // 判断存储位置
    path: { type: String, default: null }, // 储存位置，在这里 url 由查询的时候再拼接
    hash: { type: String, default: null }, // smms 的特殊配置
    size: { type: Number, required: true },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }})

export default mongoose.model('Image', ImageSchema)