import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    author: { type: Object }, // author: { type: Schema.Types.ObjectId, ref: 'User' },
    articleId: { type: Schema.Types.ObjectId, require: true },
    praise: { type: Number, default: 0 }, 
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }, // 这里 Date.now 是一个函数 在创建的时候会执行 不是的话就是一个静态的值
    updatedAt: { type: Date, default: Date.now },
  });
  
  export default mongoose.model('Comment', CommentSchema);