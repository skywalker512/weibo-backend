import LinkModel from '../../models/setting/link';
import CategoryModel from '../../models/article/catagory';
import ArticleModel from '../../models/article/article';
import ImageModel from '../../models/article/image'
import VideoModel from '../../models/article/video'
import Redis from 'koa-redis'

const Store = new Redis({ url: process.env.REDIS }).client

class IndexController {
    static async getIndex(ctx) {
        const saveRes = await Store.hget(`index-cache`, 'res')
        if (saveRes) return ctx.success({ data: JSON.parse(saveRes) });
        const article = await ArticleModel.find(null, {  lastCommentAt:0, changedBy: 0 , praise: 0 }).sort({ createdAt: '-1' }).limit(10).populate('authorId', { name: 1, avatar: 1 }).populate('categoryId', { name: 1 }).lean();
        for(const value of article) {
            value.images = await ImageModel.find({ articleId: value._id },{ url: 1, path:1 , _id:0, location: 1}).lean({ virtuals: true })
            value.videos = await VideoModel.find({ articleId: value._id },{ url: 1, path:1 , _id:0, location: 1}).lean({ virtuals: true })
        }
        const category = await CategoryModel.find(null, { name: 1 });
        const link = await LinkModel.find();
        const res = {  article, category, link }
        await Store.hmset(`index-cache`, 'res', JSON.stringify(res))
        await Store.pexpireat(`index-cache`, new Date().getTime() + 15 * 60 * 1000)
        return ctx.success({ data: res });
    }

    static async refreshIndex(ctx) {
        if (!ctx.isAuthenticated()) return ctx.error({ msg: '您还没有登陆' });
        if (!ctx.isAdmin()) return ctx.error({ msg: '您没有权限访问' });
        const delRes = await Store.hdel(`index-cache`, 'res')
        if (delRes === 1) return ctx.success({ msg: '更新首页缓存成功' });
        else return ctx.error({ msg: '更新首页缓存失败' });
    }
}

export default IndexController;