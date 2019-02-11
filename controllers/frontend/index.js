import LinkModel from '../../models/setting/link';
import CategoryModel from '../../models/article/catagory';
import ArticleModel from '../../models/article/article';

class IndexController {
    static async getIndex(ctx) {
        const articles = await ArticleModel.find(null, {createdAt: 0, updatedAt: 0, lastCommentAt:0, changedBy: 0 , praise: 0 }).sort({ createdAt: '-1' }).limit(10).populate('authorId', { name: 1, avatar: 1 }).populate('categoryId', { name: 1 });
        const categorys = await CategoryModel.find(null, { name: 1 });
        const links = await LinkModel.find();

        return ctx.success({ data: { articles, categorys, links } });
    }
}

export default IndexController;