import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LinkSchema = new Schema({
    name: { type: String, default: '' },
    icon: { type: String, default: '' },
})

export default mongoose.model('Link', LinkSchema);