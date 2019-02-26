import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const StarSchema = new Schema({
    authorId: { type: Schema.Types.ObjectId, require: true , ref: 'User'},
    starUserId: { type: Schema.Types.ObjectId, require: true, ref: 'User'},
});

export default mongoose.model('Star', StarSchema);