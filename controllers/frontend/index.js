import LinkModel from '../../models/setting/link';
import CategoryModel from '../../models/article/catagory';
import ArticleModel from '../../models/article/article';
import UserModel from '../../models/user/user';

class IndexController {
    static async getIndex(ctx) {
        const article = await ArticleModel.find(null, { createdAt: 0, lastCommentAt:0, changedBy: 0 , praise: 0 }).sort({ updatedAt: '-1' }).limit(10).populate('authorId', { name: 1, avatar: 1 }).populate('categoryId', { name: 1 });
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