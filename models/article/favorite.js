import mongoose from 'mongoose'

const Schema = mongoose.Schema

const FavoriteSchema = new Schema({
    authorId: { type: Schema.Types.ObjectId, require: true , ref: 'User'},
    articleId: { type: Schema.Types.ObjectId, require: true, ref: 'Article'},
})

export default mongoose.model('Favorite', FavoriteSchema)