import LinkModel from '../../models/setting/link';
import CategoryModel from '../../models/article/catagory';
import ArticleModel from '../../models/article/article';
import UserModel from '../../models/user/user';
import ImageModel from '../../models/article/image'
import VideoModel from '../../models/article/video'

class IndexController {
    static async getIndex(ctx) {
        const article = await ArticleModel.find(null, { createdAt: 0, lastCommentAt:0, changedBy: 0 , praise: 0 }).sort({ createdAt: '-1' }).limit(10).populate('authorId', { name: 1, avatar: 1 }).populate('categoryId', { name: 1 }).lean();
        for(const value of article) {
            value.images = await ImageModel.find({ articleId: value._id },{ url: 1, path:1 , _id:0, location: 1}).lean({ virtuals: true })
            value.videos = await VideoModel.find({ articleId: value._id },{ url: 1, path:1 , _id:0, location: 1}).lean({ virtuals: true })
        }
        const category = await CategoryModel.find(null, { name: 1 });
        const link = await LinkModel.find();
        let user
        if( ctx.session.userId ){
            user = await UserModel.findOne( {_id: ctx.session.userId}, { name:1, avatar:1 } )
        } else {
            user = null
        }
        return ctx.success({ data: { article, category, link, user } });
    }
}

export default IndexController;