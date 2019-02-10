import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CatagorySchema = new Schema({
    name: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    lastPublishAt: { type: Date, default: Date.now },  // 最热节点
})

export default mongoose.model('Catagory', CatagorySchema);