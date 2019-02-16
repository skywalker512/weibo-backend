import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CatagorySchema = new Schema({
    name: { type: String, default: '' },
    lastPublishAt: { type: Date, default: Date.now },  // 最热节点
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }})

export default mongoose.model('Catagory', CatagorySchema);