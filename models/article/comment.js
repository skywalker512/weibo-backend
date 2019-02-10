import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    author: { type: Object }, // author: { type: Schema.Types.ObjectId, ref: 'User' },
    articleId: { type: Schema.Types.ObjectId, require: true },
    praise: { type: Number, default: 0 }, 
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  export default mongoose.model('Comment', CommentSchema);