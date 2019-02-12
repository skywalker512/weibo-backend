import LinkModel from '../../models/setting/link';
import CategoryModel from '../../models/article/catagory';
import ArticleModel from '../../models/article/article';

class IndexController {
    static async getIndex(ctx) {
        const article = await ArticleModel.find(null, { updatedAt: 0, lastCommentAt:0, changedBy: 0 , praise: 0 }).sort({ updatedAt: '-1' }).limit(10).populate('authorId', { name: 1, avatar: 1 }).populate('categoryId', { name: 1 });
        const category = await CategoryModel.find(null, { name: 1 });
        const link = await LinkModel.find();

        return ctx.success({ data: { article, category, link } });
    }
}

export default IndexController;